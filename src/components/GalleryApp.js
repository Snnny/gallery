
var React = require('react/addons');


// CSS
require('normalize.css');
require('../styles/main.scss');


// 获取图片相关的数据
var imageDatas = require('../data/imageDatas.json');

// 利用自执行函数， 将图片名信息转成图片URL路径信息
imageDatas = (function genImageURL(imageDatasArr) {
    for (var i = 0, j = imageDatasArr.length; i < j; i++) {
        var singleImageData = imageDatasArr[i];

        singleImageData.imageURL = require('../images/' + singleImageData.fileName);

        imageDatasArr[i] = singleImageData;
    }

    return imageDatasArr;
})(imageDatas);
/*
*获取区间内的一个随机值
*/
function getRangeRandom(low, high){
  return Math.ceil(Math.random() * (high - low) + low);
}

/*单张img*/
var ImgFigure = React.createClass({
   render: function(){
    var styleObj = {};
    if(this.props.arrange.pos){
      styleObj = this.props.arrange.pos;
    }
    return (
        <figure className='img-figure' style={styleObj}>
          <img src={this.props.data.imageURL} alt={this.props.data.title}/>
          <figcaption>
            <h2 className='img-title'>{this.props.data.title}</h2>
          </figcaption>
        </figure>
      );
  }

});
var GalleryApp = React.createClass({
  Constant: {
      centerPos: { //中心
      left: 0,
      right: 0
    },
    hPosRange: { //水平方向取值范围
      leftSecX: [0, 0],  //左分区
      rightSecX: [0, 0], //右分区
      y: [0, 0]
    },
    vPosRange: {//垂直方向取值范围
      x: [0, 0],
      topY: [0, 0] //上分区
    }
  },
  /*
  *重新布局所有图片
  *@param centerIndex 指定居中排布的图片
  *
  */
  rearrange: function(centerIndex){
    var imgsArrangeArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,

        imgsArrangeTopArr = [],
        topImgNum = Math.floor(Math.random() * 2),
        topImgSpliceIndex = 0,
        //imgsArrangeArr去掉中心位置的图片
        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

        //首先居中 centerIndex的图片
        imgsArrangeCenterArr[0].pos = centerPos;
        //console.log("+++"centerPos)

        //取出要布局上册的图片的信息
        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
        //imgsArrangeArr去掉上侧的图片
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);
         // alert("上侧图片书"+topImgNum)
        //布局位于上侧的图片
        imgsArrangeTopArr.forEach(function(value, index){
          imgsArrangeTopArr[index].pos = {
              top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
              left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
          };
        });
        //布局左右两侧的图片
        for(var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++){
          var hPosRangeLORX = null;
      
          //前半部分布局左边，后半部分布局右边
          if(i < k){
            hPosRangeLORX = hPosRangeLeftSecX;
          } else{
            hPosRangeLORX = hPosRangeRightSecX;
          }

          imgsArrangeArr[i].pos = {
              top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
              left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
          };

        }
         if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
            imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
        }

        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

        this.setState({
            imgsArrangeArr: imgsArrangeArr
        });

  },
  /*
  *利用arrange函数，居中对应的index图片
  *@param index 需要被居中图片对应的图片信息数组的index值
  *@return {function}
  *
  */
  center: function(index){
    return function(){
      this.rearrange(index);
    }.bind(this);
  },
 //图片状态(变化)
    getInitialState: function () {
    return {
        imgsArrangeArr: [
            /*{
                pos: {
                    left: '0',
                    top: '0'
                },
                rotate: 0,    // 旋转角度
                isInverse: false,    // 图片正反面
                isCenter: false,    // 图片是否居中
            }*/
        ]
    };
  },

   //组件加载，为每张图片计算其位置的范围
   componentDidMount: function(){
    //首先拿到舞台的大小
    // var stageDOM = this.refs.stage;
    var stageDOM = React.findDOMNode(this.refs.stage),
    //舞台的宽高
    stageW = stageDOM.scrollWidth,
    stageH = stageDOM.scrollHeight,
    //舞台宽高的一半，便于计算
    halfStageW = Math.floor(stageW / 2),
    halfStageH = Math.floor(stageH / 2);
    //alert("stageW"+stageW); //没有获取到舞台的宽度
    //拿到一个imageFigure的大小
    var imgFigureDOM = React.findDOMNode(this.refs.ImgFigure0),
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfImgW = Math.floor(imgW / 2),
        halfImgH = Math.floor(imgH / 2);
        //alert("halfStageW"+halfStageW)//500
     //alert("halfImgW"+halfImgW)//320
    //计算中心图片的位置
    //alert("center:"+halfStageW - halfImgW) //NaN
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };
    //计算左侧，右侧区域图片排布位置的取值范围
    //0下线，1上线
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    //计算上侧区域图片排布位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    //第1张来居中
    this.rearrange(0);
   },
  render: function() {
    var controllerUnits = [], imgFigures = [];
      /*循环遍历图片*/
      imageDatas.forEach(function(value, index){
        //初始化图片状态
        if(!this.state.imgsArrangeArr[index]){
          this.state.imgsArrangeArr[index] = {
            pos: {
              left: 0,
              top: 0
            }
          };
        }
        imgFigures.push(<ImgFigure data={value} ref={'ImgFigure' + index} arrange = {this.state.imgsArrangeArr[index]}/>);
      }.bind(this));
    return (
      <section className='stage' ref='stage'>
        <section className='img-sec'>
          {imgFigures}
        </section>
        <nav className='controller-nav'>
          {controllerUnits}
        </nav>
      </section>
    );
  }
});
React.render(<GalleryApp />, document.getElementById('content')); // jshint ignore:line

module.exports = GalleryApp;
