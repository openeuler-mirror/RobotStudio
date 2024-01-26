// import * as grpc from '@grpc/grpc-js'
// import * as protoLoader from '@grpc/proto-loader'
// import * as path from 'path'

import path from 'path'
import { ChannelCredentials, loadPackageDefinition } from '@grpc/grpc-js'
import { loadSync } from '@grpc/proto-loader'
import {
  ServiceClientConstructor,
  GrpcObject,
  ServiceDefinition,
  ServiceClient
} from '@grpc/grpc-js/build/src/make-client'

// 注意：此处赋值为tempEnv的操作不能省略合并
// 因为在生产环境中，直接写process.env.PUBLIC会被替换为{}.PUBLIC，存在较大问题
// 参考https://cn.vitejs.dev/guide/env-and-mode.html 生产环境替换
// const tempEnv: any = process.env
// const PROTO_PATH = path.join(tempEnv.PUBLIC, '/proto/robot_grpc_service.proto')
// const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
//   keepCase: true,
//   longs: String,
//   enums: String,
//   defaults: true,
//   oneofs: true
// })
// const protoDescriptor = grpc.loadPackageDefinition(packageDefinition)
// export const roscProto = protoDescriptor.rosc as grpc.GrpcObject

export interface IServiceDetails {
  path: string
  package: string
  service: string
  ipAndport: string
  channelCredentials: ChannelCredentials
}

const makeGrpcClient = (protoService: IServiceDetails): ServiceClient => {
  const tempEnv: any = process.env
  const PROTO_PATH = path.join(tempEnv.PUBLIC, protoService.path)
  const packageDefinition = loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  })
  const grpcObj: GrpcObject = loadPackageDefinition(packageDefinition)
  const services = grpcObj[protoService.package] as GrpcObject
  const constructor = services[protoService.service] as ServiceClientConstructor
  return new constructor(
    protoService.ipAndport,
    protoService.channelCredentials
  )
}
export { makeGrpcClient }
