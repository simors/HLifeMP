/**
 * Created by yangyang on 2017/9/25.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import { Carousel, WhiteSpace, WingBlank } from 'antd-mobile'
import styles from "./shopshare.module.scss"
import {shopAction, shopSelector} from '../Shop'

class GoodsShare extends React.PureComponent {
  constructor(props) {
    super(props)
    document.title = "店铺商品"
  }

  state = {
    data: ['', '', ''],
    initialHeight: 200,
  }

  componentDidMount() {
    let {match} = this.props
    let {goodsId} = match.params
    this.props.getShopGoodsDetail({goodsId})
    // simulate img loading
    setTimeout(() => {
      this.setState({
        data: ['AiyWuByWklrrUDlFignR', 'TekJlZRVCjLFexlOCuWn', 'IJOtIlfsYdTyaDTRVrLI'],
      });
    }, 100);
  }

  render() {
    return (
      <div>
        <Carousel
          className={styles.carousel}
          autoplay={true}
          infinite
          selectedIndex={1}
          swipeSpeed={35}
          beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
          afterChange={index => console.log('slide to', index)}
          dotStyle={{width: 8, height: 8}}
          dotActiveStyle={{width: 8, height: 8}}
        >
          {this.state.data.map(ii => (
            <a href="http://www.baidu.com" key={ii}>
              <img
                src={`https://zos.alipayobjects.com/rmsportal/${ii || 'QcWDkUhvYIVEcvtosxMF'}.png`}
                alt="icon"
                onLoad={() => {
                  // fire window resize event to change height
                  window.dispatchEvent(new Event('resize'));
                  this.setState({
                    initialHeight: null,
                  });
                }}
              />
            </a>
          ))}
        </Carousel>
        <div>店铺商品</div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
  }
}

const mapDispatchToProps = {
  ...shopAction,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GoodsShare))