const state = {
  // 机器人基坐标在svg中的像素位置
  robotBaseCoor: {
    x: 224,
    y: 434
  },
  // 机器人svg模型中各个点的坐标
  robotPixelCoor: {
    leftRotationAxis: {
      x: 204,
      y: 419
    },
    leftExtensionAxis: {
      x: 148,
      y: 419
    },
    leftExtensionEndAxis: {
      x: 204,
      y: 419
    },
    leftWaferAxis: {
      x: 224,
      y: 314
    },
    leftRotationArm: {
      point1: {
        x: 204,
        y: 399
      },
      point2: {
        x: 170,
        y: 399
      },
      point3: {
        x: 204,
        y: 439
      },
      point4: {
        x: 170,
        y: 439
      },
      point5: {
        x: 148,
        y: 405
      },
      point6: {
        x: 148,
        y: 433
      }
    },
    leftExtensionArm: {
      point1: {
        x: 186,
        y: 405
      },
      point2: {
        x: 186,
        y: 434
      },
      point3: {
        x: 204,
        y: 409
      },
      point4: {
        x: 204,
        y: 430
      },
      point5: {
        x: 148,
        y: 405
      },
      point6: {
        x: 148,
        y: 433
      }
    },

    rightRotationAxis: {
      x: 244,
      y: 419
    },
    rightExtensionAxis: {
      x: 300,
      y: 419
    },
    rightExtensionEndAxis: {
      x: 244,
      y: 419
    },
    rightWaferAxis: {
      x: 224,
      y: 314
    },
    rightRotationArm: {
      point1: {
        x: 246,
        y: 399
      },
      point2: {
        x: 280,
        y: 399
      },
      point3: {
        x: 246,
        y: 439
      },
      point4: {
        x: 280,
        y: 439
      },
      point5: {
        x: 302,
        y: 405
      },
      point6: {
        x: 302,
        y: 433
      }
    },
    rightExtensionArm: {
      point1: {
        x: 264,
        y: 405
      },
      point2: {
        x: 264,
        y: 433
      },
      point3: {
        x: 244,
        y: 409
      },
      point4: {
        x: 244,
        y: 429
      },
      point5: {
        x: 302,
        y: 405
      },
      point6: {
        x: 302,
        y: 433
      }
    }
  }
}

const getters = {

}

const mutations = {
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
