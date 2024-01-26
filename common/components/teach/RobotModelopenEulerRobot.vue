<template>
  <div>
    <svg width="500" height="600">
      <g id="global_layout">
        <title>WaferArm</title>
        <g id="base_coor" stroke="null">
          <circle
            :cx="baseCoor.x"
            :cy="baseCoor.y"
            r="50"
            stroke-dasharray="5,2,2,2,2,2"
            stroke="#000"
            fill="#fff"
          />
          <line
            id="svg_1"
            stroke="#000"
            stroke-width="2"
            :x2="baseCoor.x"
            y2="650"
            :x1="baseCoor.x"
            y1="0"
            fill="none"
          />
          <line
            id="svg_1_1"
            stroke="#000"
            stroke-width="2"
            :x2="baseCoor.x - 5"
            y2="15"
            :x1="baseCoor.x"
            y1="0"
            fill="none"
          />
          <line
            id="svg_1_2"
            stroke="#000"
            stroke-width="2"
            :x2="baseCoor.x + 5"
            y2="15"
            :x1="baseCoor.x"
            y1="0"
            fill="none"
          />
          <line
            id="svg_scale_1"
            stroke="#999"
            :x2="0"
            :y2="baseCoor.y + 33.3"
            :x1="450"
            :y1="baseCoor.y + 33.3"
            fill="none"
          />
          <line
            id="svg_scale_2"
            stroke="#999"
            :x2="0"
            :y2="baseCoor.y + 66.6"
            :x1="450"
            :y1="baseCoor.y + 66.6"
            fill="none"
          />
          <line
            id="svg_scale_3"
            stroke="#999"
            :x2="0"
            :y2="baseCoor.y + 99.9"
            :x1="450"
            :y1="baseCoor.y + 99.9"
            fill="none"
          />
          <line
            id="svg_scale_3"
            stroke="#999"
            :x2="0"
            :y2="baseCoor.y + 133.2"
            :x1="450"
            :y1="baseCoor.y + 133.2"
            fill="none"
          />
          <line
            id="svg_scale_1"
            stroke="#999"
            :x2="0"
            :y2="baseCoor.y - 33.3"
            :x1="450"
            :y1="baseCoor.y - 33.3"
            fill="none"
          />
          <line
            id="svg_scale_2"
            stroke="#999"
            :x2="0"
            :y2="baseCoor.y - 66.6"
            :x1="450"
            :y1="baseCoor.y - 66.6"
            fill="none"
          />
          <line
            id="svg_scale_3"
            stroke="#999"
            :x2="0"
            :y2="baseCoor.y - 99.9"
            :x1="450"
            :y1="baseCoor.y - 99.9"
            fill="none"
          />
          <line
            id="svg_scale_4"
            stroke="#999"
            :x2="0"
            :y2="baseCoor.y - 133.2"
            :x1="450"
            :y1="baseCoor.y - 133.2"
            fill="none"
          />
          <line
            id="svg_scale_5"
            stroke="#999"
            :x2="0"
            :y2="baseCoor.y - 166.5"
            :x1="450"
            :y1="baseCoor.y - 166.5"
            fill="none"
          />
          <line
            id="svg_scale_6"
            stroke="#999"
            :x2="0"
            :y2="baseCoor.y - 199.7"
            :x1="450"
            :y1="baseCoor.y - 199.7"
            fill="none"
          />
          <line
            id="svg_scale_7"
            stroke="#999"
            :x2="0"
            :y2="baseCoor.y - 233"
            :x1="450"
            :y1="baseCoor.y - 233"
            fill="none"
          />
          <line
            id="svg_scale_8"
            stroke="#999"
            :x2="0"
            :y2="baseCoor.y - 266.3"
            :x1="450"
            :y1="baseCoor.y - 266.3"
            fill="none"
          />
          <line
            id="svg_scale_9"
            stroke="#999"
            :x2="0"
            :y2="baseCoor.y - 299.6"
            :x1="450"
            :y1="baseCoor.y - 299.6"
            fill="none"
          />
          <line
            id="svg_scale_10"
            stroke="#999"
            :x2="0"
            :y2="baseCoor.y - 332.9"
            :x1="450"
            :y1="baseCoor.y - 332.9"
            fill="none"
          />
          <line
            id="svg_scale_11"
            stroke="#999"
            :x2="0"
            :y2="baseCoor.y - 366.2"
            :x1="450"
            :y1="baseCoor.y - 366.2"
            fill="none"
          />
          <line
            id="svg_scale_10"
            stroke="#999"
            :x2="0"
            :y2="baseCoor.y - 399.5"
            :x1="450"
            :y1="baseCoor.y - 399.5"
            fill="none"
          />
          <text :x="baseCoor.x - 15" y="15">x</text>
          <line
            id="svg_2"
            stroke="#000"
            stroke-width="2"
            x1="0"
            :y1="baseCoor.y"
            x2="450"
            :y2="baseCoor.y"
            fill="none"
          />
          <line
            id="svg_2_1"
            stroke="#000"
            x1="0"
            stroke-width="2"
            :y1="baseCoor.y"
            x2="15"
            :y2="baseCoor.y - 5"
            fill="none"
          />
          <line
            id="svg_2_2"
            stroke="#000"
            x1="0"
            stroke-width="2"
            :y1="baseCoor.y"
            x2="15"
            :y2="baseCoor.y + 5"
            fill="none"
          />
          <line
            id="svg_scale_1"
            stroke="#999"
            :x2="baseCoor.x - 33.3"
            :y2="0"
            :x1="baseCoor.x - 33.3"
            :y1="650"
            fill="none"
          />
          <line
            id="svg_scale_2"
            stroke="#999"
            :x2="baseCoor.x - 66.6"
            :y2="0"
            :x1="baseCoor.x - 66.6"
            :y1="650"
            fill="none"
          />
          <line
            id="svg_scale_3"
            stroke="#999"
            :x2="baseCoor.x - 99.9"
            :y2="0"
            :x1="baseCoor.x - 99.9"
            :y1="650"
            fill="none"
          />
          <line
            id="svg_scale_4"
            stroke="#999"
            :x2="baseCoor.x - 133.2"
            :y2="0"
            :x1="baseCoor.x - 133.2"
            :y1="650"
            fill="none"
          />
          <line
            id="svg_scale_5"
            stroke="#999"
            :x2="baseCoor.x - 166.5"
            :y2="0"
            :x1="baseCoor.x - 166.5"
            :y1="650"
            fill="none"
          />
          <line
            id="svg_scale_5"
            stroke="#999"
            :x2="baseCoor.x - 199.7"
            :y2="0"
            :x1="baseCoor.x - 199.7"
            :y1="650"
            fill="none"
          />
          <line
            id="svg_scale_1"
            stroke="#999"
            :x2="baseCoor.x + 33.3"
            :y2="0"
            :x1="baseCoor.x + 33.3"
            :y1="650"
            fill="none"
          />
          <line
            id="svg_scale_2"
            stroke="#999"
            :x2="baseCoor.x + 66.6"
            :y2="0"
            :x1="baseCoor.x + 66.6"
            :y1="650"
            fill="none"
          />
          <line
            id="svg_scale_3"
            stroke="#999"
            :x2="baseCoor.x + 99.9"
            :y2="0"
            :x1="baseCoor.x + 99.9"
            :y1="650"
            fill="none"
          />
          <line
            id="svg_scale_4"
            stroke="#999"
            :x2="baseCoor.x + 133.2"
            :y2="0"
            :x1="baseCoor.x + 133.2"
            :y1="650"
            fill="none"
          />
          <line
            id="svg_scale_5"
            stroke="#999"
            :x2="baseCoor.x + 166.5"
            :y2="0"
            :x1="baseCoor.x + 166.5"
            :y1="650"
            fill="none"
          />
          <line
            id="svg_scale_5"
            stroke="#999"
            :x2="baseCoor.x + 199.7"
            :y2="0"
            :x1="baseCoor.x + 199.7"
            :y1="650"
            fill="none"
          />
          <text :y="baseCoor.y - 10" x="10">y</text>
          <circle :cx="baseCoor.x" :cy="baseCoor.y" r="2" stroke="black" />
          <line
            id="svg_scale_1"
            stroke="#000"
            stroke-width="2"
            :x2="23.3"
            :y2="33.3"
            :x1="56.6"
            :y1="33.3"
            fill="none"
          />
          <line
            id="svg_scale_1"
            stroke="#000"
            stroke-width="2"
            :x2="56.6"
            :y2="23.3"
            :x1="56.6"
            :y1="33.3"
            fill="none"
          />
          <line
            id="svg_scale_1"
            stroke="#000"
            stroke-width="2"
            :x2="24"
            :y2="24"
            :x1="24"
            :y1="34"
            fill="none"
          />
          <text :y="20" x="10">100mm</text>
        </g>
        <g id="left_rotation">
          <circle
            id="svg_26"
            stroke="#000"
            stroke-width="2"
            r="19.3"
            :cy="leftRotationAxis.y"
            :cx="leftRotationAxis.x"
            fill="none"
          />
          <line
            id="svg_29"
            stroke-width="2"
            stroke="#BBBBBB"
            :y2="leftExtensionAxis.y"
            :x2="leftExtensionAxis.x"
            :y1="leftRotationAxis.y"
            :x1="leftRotationAxis.x"
            fill="none"
          />
          <circle
            id="svg_27"
            stroke="#000"
            stroke-width="2"
            r="14"
            :cy="leftExtensionAxis.y"
            :cx="leftExtensionAxis.x"
            fill="none"
          />
          <circle
            id="svg_b"
            stroke="#888888"
            r="4"
            :cy="leftRotationAxis.y"
            :cx="leftRotationAxis.x"
            fill="#CCCCCC"
          />
          <g id="left_rotation_arm" :transform="leftRotationArmRotate">
            <line
              id="svg_30"
              fill="none"
              stroke="#000"
              stroke-width="2"
              :x1="leftRotationArm.point1.x"
              :y1="leftRotationArm.point1.y"
              :x2="leftRotationArm.point2.x"
              :y2="leftRotationArm.point2.y"
            />
            <line
              id="svg_31"
              fill="none"
              stroke="#000"
              stroke-width="2"
              :x1="leftRotationArm.point3.x"
              :y1="leftRotationArm.point3.y"
              :x2="leftRotationArm.point4.x"
              :y2="leftRotationArm.point4.y"
            />
            <line
              id="svg_32"
              fill="none"
              stroke="#000"
              stroke-width="2"
              :x1="leftRotationArm.point2.x"
              :y1="leftRotationArm.point2.y"
              :x2="leftRotationArm.point5.x"
              :y2="leftRotationArm.point5.y"
            />
            <line
              id="svg_33"
              fill="none"
              stroke="#000"
              stroke-width="2"
              :x1="leftRotationArm.point4.x"
              :y1="leftRotationArm.point4.y"
              :x2="leftRotationArm.point6.x"
              :y2="leftRotationArm.point6.y"
            />
          </g>
        </g>
        <g id="left_wafer">
          <rect
            id="left_wafer_arm1"
            stroke-width="2"
            :transform="leftWaferArmRotate1"
            height="10"
            width="8"
            :x="leftExtensionEndAxis.x"
            :y="leftExtensionEndAxis.y - 5"
            stroke="#000"
            fill="none"
          />
          <rect
            id="left_wafer_arm2"
            stroke-width="2"
            :transform="leftWaferArmRotate2"
            height="146"
            width="25"
            :x="leftWaferAxis.x - 12.5"
            :y="leftWaferAxis.y"
            stroke="#000"
            fill="none"
          />
          <circle
            id="svg_l_wafer"
            fill="#DDDDDD"
            stroke="#000"
            :cx="leftWaferAxis.x"
            :cy="leftWaferAxis.y"
            r="50"
          />
        </g>
        <g id="left_extension">
          <line
            id="svg_17"
            fill="none"
            stroke-width="2"
            stroke="#BBBBBB"
            :x1="leftExtensionAxis.x"
            :y1="leftExtensionAxis.y"
            :x2="leftExtensionEndAxis.x"
            :y2="leftExtensionEndAxis.y"
          />
          <circle
            id="svg_15"
            fill="#CCCCCC"
            stroke="#888888"
            :cx="leftExtensionAxis.x"
            :cy="leftExtensionAxis.y"
            r="4"
          />
          <circle
            id="svg_19"
            fill="none"
            stroke-width="2"
            stroke="#000"
            :cx="leftExtensionEndAxis.x"
            :cy="leftExtensionEndAxis.y"
            r="10"
          />
          <circle
            id="svg_c"
            fill="#CCCCCC"
            stroke="#888888"
            :cx="leftExtensionEndAxis.x"
            :cy="leftExtensionEndAxis.y"
            r="4"
          />
          <g id="left_extension_arm" :transform="leftExtensionArmRotate">
            <line
              id="svg_21"
              fill="none"
              stroke-width="2"
              stroke="#000"
              :x1="leftExtensionArm.point5.x"
              :y1="leftExtensionArm.point5.y"
              :x2="leftExtensionArm.point1.x"
              :y2="leftExtensionArm.point1.y"
            />
            <line
              id="svg_22"
              fill="none"
              stroke-width="2"
              stroke="#000"
              :x1="leftExtensionArm.point6.x"
              :y1="leftExtensionArm.point6.y"
              :x2="leftExtensionArm.point2.x"
              :y2="leftExtensionArm.point2.y"
            />
            <line
              id="svg_23"
              fill="none"
              stroke-width="2"
              stroke="#000"
              :x1="leftExtensionArm.point1.x"
              :y1="leftExtensionArm.point1.y"
              :x2="leftExtensionArm.point3.x"
              :y2="leftExtensionArm.point3.y"
            />
            <line
              id="svg_24"
              fill="none"
              stroke-width="2"
              stroke="#000"
              :x1="leftExtensionArm.point2.x"
              :y1="leftExtensionArm.point2.y"
              :x2="leftExtensionArm.point4.x"
              :y2="leftExtensionArm.point4.y"
            />
          </g>
        </g>
        <g id="right_rotation">
          <line
            id="svg_20"
            stroke-width="2"
            :y2="rightExtensionAxis.y"
            :x2="rightExtensionAxis.x"
            :y1="rightRotationAxis.y"
            :x1="rightRotationAxis.x"
            stroke="#BBBBBB"
            fill="none"
          />
          <circle
            id="svg_9"
            stroke="#000"
            stroke-width="2"
            r="19.3"
            :cy="rightRotationAxis.y"
            :cx="rightRotationAxis.x"
            fill="none"
          />
          <circle
            id="svg_10"
            stroke="#000"
            stroke-width="2"
            r="14"
            :cy="rightExtensionAxis.y"
            :cx="rightExtensionAxis.x"
            fill="none"
          />
          <circle
            id="svg_a"
            stroke="#888888"
            r="4"
            :cy="rightRotationAxis.y"
            :cx="rightRotationAxis.x"
            fill="#CCCCCC"
          />
          <g id="right_rotation_arm" :transform="rightRotationArmRotate">
            <line
              id="svg_3"
              fill="none"
              stroke-width="2"
              stroke="#000"
              :x1="rightRotationArm.point1.x"
              :y1="rightRotationArm.point1.y"
              :x2="rightRotationArm.point2.x"
              :y2="rightRotationArm.point2.y"
            />
            <line
              id="svg_7"
              fill="none"
              stroke-width="2"
              stroke="#000"
              :x1="rightRotationArm.point3.x"
              :y1="rightRotationArm.point3.y"
              :x2="rightRotationArm.point4.x"
              :y2="rightRotationArm.point4.y"
            />
            <line
              id="svg_8"
              fill="none"
              stroke-width="2"
              stroke="#000"
              :x1="rightRotationArm.point2.x"
              :y1="rightRotationArm.point2.y"
              :x2="rightRotationArm.point5.x"
              :y2="rightRotationArm.point5.y"
            />
            <line
              id="svg_11"
              fill="none"
              stroke-width="2"
              stroke="#000"
              :x1="rightRotationArm.point4.x"
              :y1="rightRotationArm.point4.y"
              :x2="rightRotationArm.point6.x"
              :y2="rightRotationArm.point6.y"
            />
          </g>
        </g>
        <g id="right_wafer">
          <rect
            id="right_wafer_arm1"
            stroke-width="2"
            :transform="rightWaferArmRotate1"
            height="10"
            width="8"
            :x="rightExtensionEndAxis.x - 7.5"
            :y="rightExtensionEndAxis.y - 5"
            stroke="#000"
            fill="none"
          />
          <rect
            id="right_wafer_arm2"
            stroke-width="2"
            :transform="rightWaferArmRotate2"
            height="146"
            width="25"
            :x="rightWaferAxis.x - 12.5"
            :y="rightWaferAxis.y"
            stroke="#000"
            fill="none"
          />
          <circle
            id="svg_r_wafer"
            fill="#DDDDDD"
            stroke="#000"
            :cx="rightWaferAxis.x"
            :cy="rightWaferAxis.y"
            r="50"
          />
        </g>
        <g id="right_extension">
          <line
            id="svg_36"
            fill="none"
            stroke-width="2"
            stroke="#BBBBBB"
            :x1="rightExtensionAxis.x"
            :y1="rightExtensionAxis.y"
            :x2="rightExtensionEndAxis.x"
            :y2="rightExtensionEndAxis.y"
          />
          <circle
            id="svg_35"
            fill="#CCCCCC"
            stroke="#888888"
            :cx="rightExtensionAxis.x"
            :cy="rightExtensionAxis.y"
            r="4"
          />
          <circle
            id="svg_37"
            fill="none"
            stroke-width="2"
            stroke="#000"
            :cx="rightExtensionEndAxis.x"
            :cy="rightExtensionEndAxis.y"
            r="10"
          />
          <circle
            id="svg_d"
            fill="#CCCCCC"
            stroke="#888888"
            :cx="rightExtensionEndAxis.x"
            :cy="rightExtensionEndAxis.y"
            r="4"
          />
          <g id="right_extension_arm" :transform="rightExtensionArmRotate">
            <line
              id="svg_38"
              fill="none"
              stroke-width="2"
              stroke="#000"
              :x1="rightExtensionArm.point5.x"
              :y1="rightExtensionArm.point5.y"
              :x2="rightExtensionArm.point1.x"
              :y2="rightExtensionArm.point1.y"
            />
            <line
              id="svg_39"
              fill="none"
              stroke-width="2"
              stroke="#000"
              :x1="rightExtensionArm.point6.x"
              :y1="rightExtensionArm.point6.y"
              :x2="rightExtensionArm.point2.x"
              :y2="rightExtensionArm.point2.y"
            />
            <line
              id="svg_40"
              fill="none"
              stroke-width="2"
              stroke="#000"
              :x1="rightExtensionArm.point1.x"
              :y1="rightExtensionArm.point1.y"
              :x2="rightExtensionArm.point3.x"
              :y2="rightExtensionArm.point3.y"
            />
            <line
              id="svg_41"
              fill="none"
              stroke-width="2"
              stroke="#000"
              :x1="rightExtensionArm.point2.x"
              :y1="rightExtensionArm.point2.y"
              :x2="rightExtensionArm.point4.x"
              :y2="rightExtensionArm.point4.y"
            />
          </g>
        </g>
        <!-- <g id="load_wafer">
                    <circle id="test" fill="#FFFFFF" stroke-width="5" stroke="#999999" :cx="testCircle.x" :cy="testCircle.y" r="50" @mousedown="mouseDown" @mouseup="mouseUp" @mouseleave="mouseLeave" @mousemove="mouseMove($event)"/>
                    <circle id="test" fill="#FFFFFF" stroke="#000" :cx="testCircle.x" :cy="testCircle.y" r="45" @mousedown="mouseDown" @mouseleave="mouseLeave" @mousemove="mouseMove($event)"/>
                    <text xml:space="preserve" text-anchor="start" font-family="Noto Sans JP" font-size="15" id="aaaa" :y="testCircle.y" :x="testCircle.x-35" stroke-width="0" stroke="#000" fill="#000000">{{showTextCircle}}</text>
                </g> -->
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'RobotModelM201',

  props: {
    joint: Array
  },
  data() {
    return {
      bladeLength: 305.0,
      baseCoor: { x: 224, y: 434 }, // 用于机器人坐标系和图像坐标系的相互转换
      zoomRadio: 3.0, // 缩小因子
      leftRotationArmRotate: '',
      leftExtensionArmRotate: '',
      leftWaferArmRotate1: '',
      leftWaferArmRotate2: '',
      rightRotationArmRotate: '',
      rightExtensionArmRotate: '',
      rightWaferArmRotate1: '',
      rightWaferArmRotate2: '',
      // 图像坐标系下各个轴的像素坐标
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
        y: 278
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
        y: 278
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
      },
      drawInterval: null,
      joints: [0, 0, 0, 0],
      testCircle: {
        x: 54,
        y: 131
      },
      showTextCircle: '(909, 510)',
      mousedown: false
    }
  },
  activated() {
    this.startDrawInterval()
  },
  deactivated() {
    clearInterval(this.drawInterval)
  },
  methods: {
    calculateCoorArm(axisLeft, axisRight, rotation) {
      // R0固定
      const R0 = { x: 45, y: -60 }
      const R1 = { x: 0, y: 0 }
      // R1
      R1.x = R0.x - (this.bladeLength - axisRight) / 2
      R1.y = R0.y - Math.sqrt(168 ** 2 - (R0.x - R1.x) ** 2)
      // R2
      const R2 = { x: 0, y: 0 }
      R2.x = R0.x + axisRight - this.bladeLength
      R2.y = R0.y
      // RWafer
      const RWafer = { x: 0, y: 0 }
      RWafer.x = R2.x + 425

      // L0固定
      const L0 = {
        x: 45,
        y: 60
      }
      const L1 = { x: 0, y: 0 }
      const L2 = { x: 0, y: 0 }
      // L1
      L1.x = L0.x - (this.bladeLength - axisLeft) / 2
      L1.y = L0.y + Math.sqrt(168 ** 2 - (L0.x - L1.x) ** 2)
      // L2
      L2.x = L0.x + axisLeft - this.bladeLength
      L2.y = L0.y
      // LWafer
      const LWafer = { x: 0, y: 0 }
      LWafer.x = L2.x + 425
      LWafer.y = 0

      // 根据旋转角度对每个点位进行旋转变换
      const theta = (rotation / 180) * Math.PI
      // R0
      let x = R0.x * Math.cos(theta) + R0.y * Math.sin(theta)
      let y = R0.y * Math.cos(theta) - R0.x * Math.sin(theta)
      R0.x = x
      R0.y = y
      // R1
      x = R1.x * Math.cos(theta) + R1.y * Math.sin(theta)
      y = R1.y * Math.cos(theta) - R1.x * Math.sin(theta)
      R1.x = x
      R1.y = y
      x = R2.x * Math.cos(theta) + R2.y * Math.sin(theta)
      y = R2.y * Math.cos(theta) - R2.x * Math.sin(theta)
      R2.x = x
      R2.y = y
      // RWafer
      x = RWafer.x * Math.cos(theta) + RWafer.y * Math.sin(theta)
      y = RWafer.y * Math.cos(theta) - RWafer.x * Math.sin(theta)
      RWafer.x = x
      RWafer.y = y

      // L0
      x = L0.x * Math.cos(theta) + L0.y * Math.sin(theta)
      y = L0.y * Math.cos(theta) - L0.x * Math.sin(theta)
      L0.x = x
      L0.y = y
      // L1
      x = L1.x * Math.cos(theta) + L1.y * Math.sin(theta)
      y = L1.y * Math.cos(theta) - L1.x * Math.sin(theta)
      L1.x = x
      L1.y = y
      // L2
      x = L2.x * Math.cos(theta) + L2.y * Math.sin(theta)
      y = L2.y * Math.cos(theta) - L2.x * Math.sin(theta)
      L2.x = x
      L2.y = y
      // LWafer
      x = LWafer.x * Math.cos(theta) + LWafer.y * Math.sin(theta)
      y = LWafer.y * Math.cos(theta) - LWafer.x * Math.sin(theta)
      LWafer.x = x
      LWafer.y = y
      const robotCoors = {
        L0,
        L1,
        L2,
        LWafer,
        R0,
        R1,
        R2,
        RWafer
      }
      return robotCoors
    },

    // 机器人坐标系下的各个关节的坐标点向图像坐标系下转换
    coorTransfer(L0, L1, L2, LWafer, R0, R1, R2, RWafer) {
      // 坐标系原点变化
      const pixelL0 = {
        x: -L0.y / this.zoomRadio + this.baseCoor.x,
        y: -L0.x / this.zoomRadio + this.baseCoor.y
      }
      const pixelL1 = {
        x: -L1.y / this.zoomRadio + this.baseCoor.x,
        y: -L1.x / this.zoomRadio + this.baseCoor.y
      }
      const pixelL2 = {
        x: -L2.y / this.zoomRadio + this.baseCoor.x,
        y: -L2.x / this.zoomRadio + this.baseCoor.y
      }
      const pixelLWafer = {
        x: -LWafer.y / this.zoomRadio + this.baseCoor.x,
        y: -LWafer.x / this.zoomRadio + this.baseCoor.y
      }
      const pixelR0 = {
        x: -R0.y / this.zoomRadio + this.baseCoor.x,
        y: -R0.x / this.zoomRadio + this.baseCoor.y
      }
      const pixelR1 = {
        x: -R1.y / this.zoomRadio + this.baseCoor.x,
        y: -R1.x / this.zoomRadio + this.baseCoor.y
      }
      const pixelR2 = {
        x: -R2.y / this.zoomRadio + this.baseCoor.x,
        y: -R2.x / this.zoomRadio + this.baseCoor.y
      }
      const pixelRWafer = {
        x: -RWafer.y / this.zoomRadio + this.baseCoor.x,
        y: -RWafer.x / this.zoomRadio + this.baseCoor.y
      }
      const pixelCoors = {
        pixelL0,
        pixelL1,
        pixelL2,
        pixelLWafer,
        pixelR0,
        pixelR1,
        pixelR2,
        pixelRWafer
      }
      return pixelCoors
    },

    // 根据各个轴的像素坐标计算各个组件的变化（旋转和平移）
    calculateTranslate(L0, L1, L2, LWafer, R0, R1, R2, RWafer) {
      const leftRotationAxisTranslate = {
        x: L0.x - this.leftRotationAxis.x,
        y: L0.y - this.leftRotationAxis.y
      }
      for (const item in this.leftRotationArm) {
        this.leftRotationArm[item].x =
          this.leftRotationArm[item].x + leftRotationAxisTranslate.x
        this.leftRotationArm[item].y =
          this.leftRotationArm[item].y + leftRotationAxisTranslate.y
      }
      const leftExtensionAxisTranslate = {
        x: L1.x - this.leftExtensionAxis.x,
        y: L1.y - this.leftExtensionAxis.y
      }
      for (const item in this.leftExtensionArm) {
        this.leftExtensionArm[item].x =
          this.leftExtensionArm[item].x + leftExtensionAxisTranslate.x
        this.leftExtensionArm[item].y =
          this.leftExtensionArm[item].y + leftExtensionAxisTranslate.y
      }
      this.leftRotationAxis = JSON.parse(JSON.stringify(L0), null)
      this.leftExtensionAxis = JSON.parse(JSON.stringify(L1), null)
      this.leftExtensionEndAxis = JSON.parse(JSON.stringify(L2), null)
      this.leftWaferAxis = JSON.parse(JSON.stringify(LWafer), null)

      const rightRotationAxisTranslate = {
        x: R0.x - this.rightRotationAxis.x,
        y: R0.y - this.rightRotationAxis.y
      }
      for (const item in this.rightRotationArm) {
        this.rightRotationArm[item].x =
          this.rightRotationArm[item].x + rightRotationAxisTranslate.x
        this.rightRotationArm[item].y =
          this.rightRotationArm[item].y + rightRotationAxisTranslate.y
      }
      const rightExtensionAxisTranslate = {
        x: R1.x - this.rightExtensionAxis.x,
        y: R1.y - this.rightExtensionAxis.y
      }
      for (const item in this.rightExtensionArm) {
        this.rightExtensionArm[item].x =
          this.rightExtensionArm[item].x + rightExtensionAxisTranslate.x
        this.rightExtensionArm[item].y =
          this.rightExtensionArm[item].y + rightExtensionAxisTranslate.y
      }
      this.rightRotationAxis = JSON.parse(JSON.stringify(R0), null)
      this.rightExtensionAxis = JSON.parse(JSON.stringify(R1), null)
      this.rightExtensionEndAxis = JSON.parse(JSON.stringify(R2), null)
      this.rightWaferAxis = JSON.parse(JSON.stringify(RWafer), null)
    },

    calculateLeftArmRotate() {
      let rotateAngle =
        (Math.atan(
          (this.leftExtensionAxis.y - this.leftRotationAxis.y) /
            (this.leftExtensionAxis.x - this.leftRotationAxis.x)
        ) *
          180) /
        Math.PI
      if (this.joints[1] > 0) {
        if (
          rotateAngle < 0 &&
          this.leftExtensionAxis.y < this.leftRotationAxis.y
        ) {
          rotateAngle = 180 + rotateAngle
        }
      } else if (this.joints[1] < 0) {
        if (
          rotateAngle > 0 &&
          this.leftRotationAxis.x <= this.leftExtensionAxis.x
        ) {
          rotateAngle += 180
        }
      }

      this.leftRotationArmRotate = `rotate(${rotateAngle} ${this.leftRotationAxis.x} ${this.leftRotationAxis.y})`

      let extensionAngle =
        (Math.atan(
          (this.leftExtensionEndAxis.y - this.leftExtensionAxis.y) /
            (this.leftExtensionEndAxis.x - this.leftExtensionAxis.x)
        ) *
          180) /
        Math.PI
      if (this.joints[1] > 0) {
        if (
          extensionAngle < 0 &&
          this.leftExtensionEndAxis.x < this.leftExtensionAxis.x
        ) {
          extensionAngle = 180 + extensionAngle
        }
      } else if (this.joints[1] < 0) {
        if (
          extensionAngle > 0 &&
          this.leftExtensionEndAxis.y < this.leftExtensionAxis.y
        ) {
          extensionAngle += 180
        }
      }
      this.leftExtensionArmRotate = `rotate(${extensionAngle} ${this.leftExtensionAxis.x} ${this.leftExtensionAxis.y})`

      this.leftWaferArmRotate1 = `rotate(${this.joints[1]} ${this.leftExtensionEndAxis.x} ${this.leftExtensionEndAxis.y})`
      this.leftWaferArmRotate2 = `rotate(${this.joints[1]} ${this.leftWaferAxis.x} ${this.leftWaferAxis.y})`
    },

    calculateRightArmRotate() {
      let rotateAngle =
        (Math.atan(
          (this.rightExtensionAxis.y - this.rightRotationAxis.y) /
            (this.rightExtensionAxis.x - this.rightRotationAxis.x)
        ) *
          180) /
        Math.PI
      if (this.joints[1] > 0) {
        if (
          rotateAngle < 0 &&
          this.rightExtensionAxis.y > this.rightRotationAxis.y
        ) {
          rotateAngle = 180 + rotateAngle
        }
      } else if (this.joints[1] < 0) {
        if (
          rotateAngle > 0 &&
          this.rightRotationAxis.y > this.rightExtensionAxis.y
        ) {
          rotateAngle += 180
        }
      }
      this.rightRotationArmRotate = `rotate(${rotateAngle} ${this.rightRotationAxis.x} ${this.rightRotationAxis.y})`

      let extensionAngle =
        (Math.atan(
          (this.rightExtensionEndAxis.y - this.rightExtensionAxis.y) /
            (this.rightExtensionEndAxis.x - this.rightExtensionAxis.x)
        ) *
          180) /
        Math.PI
      if (this.joints[1] > 0) {
        if (
          extensionAngle < 0 &&
          this.rightExtensionEndAxis.x > this.rightExtensionAxis.x
        ) {
          extensionAngle = 180 + extensionAngle
        }
      } else if (this.joints[1] < 0) {
        if (
          extensionAngle > 0 &&
          this.rightExtensionEndAxis.x > this.rightExtensionAxis.x
        ) {
          extensionAngle += 180
        }
      }
      this.rightExtensionArmRotate = `rotate(${extensionAngle} ${this.rightExtensionAxis.x} ${this.rightExtensionAxis.y})`

      this.rightWaferArmRotate1 = `rotate(${this.joints[1]} ${this.rightExtensionEndAxis.x} ${this.rightExtensionEndAxis.y})`
      this.rightWaferArmRotate2 = `rotate(${this.joints[1]} ${this.rightWaferAxis.x} ${this.rightWaferAxis.y})`
    },

    draw() {
      if (this.joints.toString() !== this.joint.toString()) {
        // let joints = getCurrentJoints()
        this.joints = JSON.parse(JSON.stringify(this.joint))
        this.joints[1] = -this.joints[1]
        const robotCoors = this.calculateCoorArm(
          parseFloat(this.joints[2]),
          parseFloat(this.joints[3]),
          parseFloat(this.joints[1])
        )
        const pixelCoors = this.coorTransfer(
          robotCoors.L0,
          robotCoors.L1,
          robotCoors.L2,
          robotCoors.LWafer,
          robotCoors.R0,
          robotCoors.R1,
          robotCoors.R2,
          robotCoors.RWafer
        )
        this.calculateTranslate(
          pixelCoors.pixelL0,
          pixelCoors.pixelL1,
          pixelCoors.pixelL2,
          pixelCoors.pixelLWafer,
          pixelCoors.pixelR0,
          pixelCoors.pixelR1,
          pixelCoors.pixelR2,
          pixelCoors.pixelRWafer
        )
        this.calculateRightArmRotate()
        this.calculateLeftArmRotate()
      }
    },

    // startDrawInterval() {
    //     this.drawInterval = setInterval(() => {
    //         this.draw()
    //     }, 100)
    // },

    startDrawInterval() {
      this.drawInterval = setInterval(() => {
        this.draw()
      }, 100)
    },

    pixelCoorToRobotCoor(pixelCoor) {
      const robotCoor = {
        x: (-pixelCoor.y + this.baseCoor.y) * this.zoomRadio,
        y: (-pixelCoor.x + this.baseCoor.x) * this.zoomRadio
      }
      return robotCoor
    },
    mouseDown() {
      this.mousedown = true
      document.getElementById('test').setAttribute('fill', '#8CD79F')
    },
    mouseLeave() {
      this.mousedown = false
      document.getElementById('test').setAttribute('fill', '#FFFFFF')
    },
    mouseUp() {
      this.mousedown = false
      document.getElementById('test').setAttribute('fill', '#FFFFFF')
    },
    mouseMove(event) {
      if (this.mousedown) {
        this.testCircle.x += event.movementX
        this.testCircle.y += event.movementY
        const robotCoor = this.pixelCoorToRobotCoor(this.testCircle)
        this.showTextCircle = `(${robotCoor.x}, ${robotCoor.y})`
        // document.getElementById("test").setAttribute("cx", this.testCircle.x+event.movementX)
        // document.getElementById("test").setAttribute("cy", this.testCircle.y+event.movementY)
        // console.log()
      }
    }
  }
}
</script>
