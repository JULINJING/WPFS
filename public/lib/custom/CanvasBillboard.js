// 通过Canvas绘制复杂或动态对象的图标点Graphic
import * as mars3d from 'mars3d'
class CanvasBillboard extends mars3d.graphic.BillboardPrimitive {
  /**
   * 文字
   * @type {string}
   */
  get text() {
    return this.style.text
  }

  set text(val) {
    this.style.text = val
    if (this._map) {
      this._updateCanvas()
    }
  }

  /**
   * 对象添加到图层前创建一些对象的钩子方法，
   * 只会调用一次
   * @return {Promise<object>}  无
   * @private
   */
  _mountedHook() {
    super._mountedHook()

    if (this._pngImage) {
      this._updateCanvas()
    } else {
      this.style.imageUrl = "../../imgs/textPnl.png" // 图片对象
      this.style.width = 480
      this.style.height = 224

      const img = new Image(this.style.width, this.style.height)
      img.crossOrigin = "Anonymous"
      img.src = this.style.imageUrl
      img.onload = () => {
        this._pngImage = img
        this._updateCanvas()
      }
    }
  }

  // 创建canvas
  _updateCanvas() {
    if (!this._pngImage || this._map.camera.positionCartographic.height > 20000000) {
      return
    }

    const canvas = document.createElement("canvas")
    canvas.id = this.id
    canvas.width = this.style.width
    canvas.height = this.style.height

    const ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // 绘制图片
    ctx.drawImage(this._pngImage, 0, 0)

    // 绘制文字
    ctx.fillStyle = "rgb(255, 255, 255)"
    ctx.font = "48px 楷体"
    ctx.textBaseline = "middle"
    ctx.fillText("预测功率：", canvas.width / 10, canvas.height / 2)
    ctx.fillText(this.style.text, canvas.width / 2 + 48, canvas.height / 2)
    ctx.fillText("W", canvas.width / 10 * 8, canvas.height / 2)

    // 将图片赋予给矢量对象进行显示，this.image是父类的属性
    // this.image = canvas
    this.image = canvas.toDataURL("image/png")
  }
}

// 注册下
mars3d.GraphicUtil.register("canvasBillboard", CanvasBillboard)

mars3d.graphic.CanvasBillboard = CanvasBillboard
