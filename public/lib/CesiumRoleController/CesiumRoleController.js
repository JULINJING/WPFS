export default class CesiumRoleController {
  constructor(Cesium, viewer) {
    this.Cesium = Cesium
    this.viewer = viewer
    this.hpRoll = new Cesium.HeadingPitchRoll(0, 0, 0)
    this.position = null
    this.speed = 1
    this.rolePrimitive = null
    this.boundingSphere = null
    this.speedVector = new Cesium.Cartesian3()
    this.hpRange = new Cesium.HeadingPitchRange()
    this.converter = Cesium.Transforms.localFrameToFixedFrameGenerator(
      'north',
      'west'
    )
    this.cartographic_terrain = null
    this.cartographic_3dtiles = null
    this.event = false
    this.radian = Cesium.Math.toRadians(1)
    this.flag = {
      moveUp: false,
      moveDown: false,
      moveLeft: false,
      moveRight: false,
    }
    this.options = null
    this.keydownFlag = false
    document.addEventListener('keydown', (e) => {
      if (this.event) {
        this.setFlagStatus(e, true)
      }
    })

    document.addEventListener('keyup', (e) => {
      if (this.event) {
        this.setFlagStatus(e, false)
      }
    })

    viewer.clock.onTick.addEventListener((clock) => {
      if (this.event) {
        if (this.flag.moveUp) {
          if (this.flag.moveLeft) {
            this.hpRoll.heading -= this.radian
          }

          if (this.flag.moveRight) {
            this.hpRoll.heading += this.radian
          }
          this.move(true)
        }

        if (this.flag.moveDown) {
          if (this.flag.moveLeft) {
            this.hpRoll.heading -= this.radian
          }

          if (this.flag.moveRight) {
            this.hpRoll.heading += this.radian
          }
          this.move(false)
        }

        if (
          this.flag.moveLeft &&
          !this.flag.moveDown &&
          !this.flag.moveUp &&
          !this.flag.moveRight
        ) {
          this.hpRoll.heading -= this.radian
          Cesium.Transforms.headingPitchRollToFixedFrame(
            this.position,
            this.hpRoll,
            Cesium.Ellipsoid.WGS84,
            this.converter,
            this.rolePrimitive.modelMatrix
          )
        }

        if (
          this.flag.moveRight &&
          !this.flag.moveDown &&
          !this.flag.moveUp &&
          !this.flag.moveLeft
        ) {
          this.hpRoll.heading += this.radian
          Cesium.Transforms.headingPitchRollToFixedFrame(
            this.position,
            this.hpRoll,
            Cesium.Ellipsoid.WGS84,
            this.converter,
            this.rolePrimitive.modelMatrix
          )
        }
      }
    })
  }
  init(Options) {
    this.viewer.scene.preUpdate.addEventListener((scene, time) => {
      if (this.event) {
        if (this.rolePrimitive && this.boundingSphere) {
          if (this.keydownFlag) {
            this.zoomToModel(Options)
          }
        }
      }
    })
    this.options = Options
    this.options.speed ? (this.speed = this.options.speed) : (this.speed = 1)
    this.position = this.Cesium.Cartesian3.fromDegrees(
      this.options.position[0],
      this.options.position[1],
      this.options.position[2]
    )
    this.event = true
    let winPosition = this.Cesium.SceneTransforms.wgs84ToWindowCoordinates(
      this.viewer.scene,
      this.position
    )
    var ray = this.viewer.camera.getPickRay(winPosition)
    var cartesian_terrain = this.viewer.scene.globe.pick(ray, this.viewer.scene)
    var cartesian_3dtiles = this.viewer.scene.pickPosition(winPosition)

    if (cartesian_terrain) {
      this.cartographic_terrain =
        this.Cesium.Cartographic.fromCartesian(cartesian_terrain)
    }
    if (cartesian_3dtiles) {
      this.cartographic_3dtiles =
        this.Cesium.Cartographic.fromCartesian(cartesian_3dtiles)
    }

    if (this.cartographic_3dtiles && this.cartographic_3dtiles.height > 0) {
      this.viewer.scene
        .clampToHeightMostDetailed([this.position])
        .then((newP) => {
          if (this.Cesium.Cartographic.fromCartesian(newP[0]).height > 0) {
            this.position = newP[0]
            this.addModel(this.position, Options)
          }
        })
    } else if (this.cartographic_terrain) {
      if (this.cartographic_terrain.height > 0) {
        this.Cesium.sampleTerrainMostDetailed(this.viewer.terrainProvider, [
          this.viewer.scene.globe.ellipsoid.cartesianToCartographic(
            this.position
          ),
        ]).then(async (newP) => {
          this.position =
            this.viewer.scene.globe.ellipsoid.cartographicToCartesian(newP[0])
          this.addModel(this.position, Options)
        })
      } else {
        this.addModel(this.position, Options)
      }
    } else {
      this.addModel(this.position, Options)
    }
  }
  setFlagStatus(key, value) {
    switch (key.keyCode) {
      case 65:
        this.flag.moveLeft = value
        break
      case 87:
        this.validateKey(value)
        this.flag.moveUp = value
        break
      case 68:
        this.flag.moveRight = value
        break
      case 83:
        this.validateKey(value)
        this.flag.moveDown = value
        break
    }
  }
  validateKey(value) {
    this.viewer.clockViewModel.shouldAnimate = value
    this.keydownFlag = value
  }
  zoomToModel(Options) {
    var r =
      2.0 *
      Math.max(this.boundingSphere.radius, this.viewer.camera.frustum.near)
    let pitch = 0
    let lockViewLevel = 0
    let range = 0
    Options.pitch ? (pitch = Options.pitch) : (pitch = -25)
    Options.lockViewLevel
      ? (lockViewLevel = Options.lockViewLevel)
      : (lockViewLevel = 3)
    Options.range ? (range = Options.range) : (range = 4.0)
    switch (lockViewLevel) {
      case 1:
        this.hpRange.heading = this.viewer.camera.heading
        this.hpRange.pitch = this.viewer.camera.pitch
        break
      case 2:
        this.hpRange.heading =
          this.hpRoll.heading - this.Cesium.Math.toRadians(90)
        this.hpRange.pitch = this.viewer.camera.pitch
        break
      default:
        this.hpRange.heading =
          this.hpRoll.heading - this.Cesium.Math.toRadians(90)
        this.hpRange.pitch = this.Cesium.Math.toRadians(pitch)
        break
    }
    this.hpRange.range = r * range
    this.viewer.camera.lookAt(this.boundingSphere.center, this.hpRange)
  }
  move(isUP) {
    if (isUP > 0) {
      this.speedVector = this.Cesium.Cartesian3.multiplyByScalar(
        this.Cesium.Cartesian3.UNIT_Y,
        this.speed,
        this.speedVector
      )
    } else {
      this.speedVector = this.Cesium.Cartesian3.multiplyByScalar(
        this.Cesium.Cartesian3.UNIT_Y,
        -this.speed,
        this.speedVector
      )
    }
    this.position = this.Cesium.Matrix4.multiplyByPoint(
      this.rolePrimitive.modelMatrix,
      this.speedVector,
      this.position
    )

    if (this.cartographic_3dtiles && this.cartographic_3dtiles.height > 0) {
      this.viewer.scene
        .clampToHeightMostDetailed([this.position])
        .then((newP) => {
          if (this.Cesium.Cartographic.fromCartesian(newP[0]).height > 0) {
            this.position = newP[0]
            this.Cesium.Transforms.headingPitchRollToFixedFrame(
              this.position,
              this.hpRoll,
              this.Cesium.Ellipsoid.WGS84,
              this.converter,
              this.rolePrimitive.modelMatrix
            )
          }
        })
    } else if (this.cartographic_terrain) {
      if (this.cartographic_terrain.height > 0) {
        this.Cesium.sampleTerrainMostDetailed(this.viewer.terrainProvider, [
          this.viewer.scene.globe.ellipsoid.cartesianToCartographic(
            this.position
          ),
        ]).then((newP) => {
          this.position =
            this.viewer.scene.globe.ellipsoid.cartographicToCartesian(newP[0])
          this.Cesium.Transforms.headingPitchRollToFixedFrame(
            this.position,
            this.hpRoll,
            this.Cesium.Ellipsoid.WGS84,
            this.converter,
            this.rolePrimitive.modelMatrix
          )
        })
      } else {
        let Cartographic =
          this.viewer.scene.globe.ellipsoid.cartesianToCartographic(
            this.position
          )
        Cartographic.height = 0
        this.position =
          this.viewer.scene.globe.ellipsoid.cartographicToCartesian(
            Cartographic
          )
        this.Cesium.Transforms.headingPitchRollToFixedFrame(
          this.position,
          this.hpRoll,
          this.Cesium.Ellipsoid.WGS84,
          this.converter,
          this.rolePrimitive.modelMatrix
        )
      }
    } else {
      let Cartographic =
        this.viewer.scene.globe.ellipsoid.cartesianToCartographic(this.position)
      Cartographic.height = 0
      this.position =
        this.viewer.scene.globe.ellipsoid.cartographicToCartesian(Cartographic)
      this.Cesium.Transforms.headingPitchRollToFixedFrame(
        this.position,
        this.hpRoll,
        this.Cesium.Ellipsoid.WGS84,
        this.converter,
        this.rolePrimitive.modelMatrix
      )
    }
  }
  reset() {
    this.hpRoll = new this.Cesium.HeadingPitchRoll(0, 0, 0)
    this.position = null
    this.speed = 1
    this.rolePrimitive = null
    this.boundingSphere = null
    this.speedVector = new this.Cesium.Cartesian3()
    this.hpRange = new this.Cesium.HeadingPitchRange()
    this.converter = this.Cesium.Transforms.localFrameToFixedFrameGenerator(
      'north',
      'west'
    )
    this.cartographic_terrain = null
    this.cartographic_3dtiles = null
    this.event = false
    this.radian = this.Cesium.Math.toRadians(1)
    this.flag = {
      moveUp: false,
      moveDown: false,
      moveLeft: false,
      moveRight: false,
    }
    this.options = null
    this.keydownFlag = false
  }
  destroy() {
    this.event = false
    this.viewer.camera.lookAtTransform(this.Cesium.Matrix4.IDENTITY)
    this.viewer.scene.primitives.remove(this.rolePrimitive)
    this.reset()
  }
  async addModel(position, Options) {
    let model = await this.Cesium.Model.fromGltfAsync({
      url: Options.url,
      modelMatrix: this.Cesium.Transforms.headingPitchRollToFixedFrame(
        position,
        this.hpRoll,
        this.Cesium.Ellipsoid.WGS84,
        this.converter
      ),
      minimumPixelSize: 40,
    })
    this.rolePrimitive = this.viewer.scene.primitives.add(model)
    this.rolePrimitive.readyEvent.addEventListener(() => {
      if (Options.animation) {
        this.rolePrimitive.activeAnimations.add({
          name: Options.animation,
          loop: this.Cesium.ModelAnimationLoop.REPEAT,
        })
      }

      this.viewer.clockViewModel.shouldAnimate = false
      this.boundingSphere = this.rolePrimitive.boundingSphere
      this.zoomToModel(this.options)
    })
  }
}
