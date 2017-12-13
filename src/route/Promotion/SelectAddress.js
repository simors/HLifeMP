/**
 * Created by wanpeng on 2017/12/9.
 */
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import {mineAction, mineSelector} from '../Mine'
import styles from './selectaddress.module.scss'

class SelectAddress extends PureComponent {
  constructor(props) {
    super(props)
    document.title = "选择收货地址"
    this.state = {
      defaultAddressId: undefined
    }
  }

  componentWillMount() {
    const {fetchMyAddr} = this.props
    fetchMyAddr({
      isRefresh: true,
      lastCreatedAt: undefined,
    })
  }

  gotoAddAddress = () => {
    const {history} = this.props
    history.push('/createMyAddr')
  }

  gotoUpdateAddress(addressId) {
    const {history} = this.props
    history.push('/updateMyAddr/' + addressId)
  }

  goBack(addressId) {
    const {history, location} = this.props
    const {state} = location
    var {metadata} = state
    history.push('/submitOrder', {metadata: metadata, addressId: addressId})
  }

  render() {
    const {addressList} = this.props
    console.log("this.props", this.props)
    return(
      <div className={styles.page}>
        {
          addressList.map((record) => {
            return(
              <div key={record.id} className={styles.container}>
                <div className={styles.item}>
                  <div className={styles.user}>
                    <div className={styles.username}>{record.username}</div>
                    <div className={styles.phone}>{record.mobilePhoneNumber}</div>
                    <div className={styles.tag}>{record.tag}</div>
                    <div className={styles.edit}>
                      <img src={require('../../asset/svg/edite@100x.svg')} alt=""
                           style={{width: '0.5rem', height: '0.5rem'}} onClick={() => this.gotoUpdateAddress(record.id)}/>
                    </div>
                  </div>
                  <div className={styles.address}>{record.addr}</div>
                </div>
                <div className={styles.op}>
                  <div className={styles.default}>
                    <img src={require('../../asset/svg/select@100x.svg')} alt=""
                         style={{width: '0.5rem', height: '0.5rem'}} onClick={() => {}}/>
                    <span className={styles.title}>设为默认</span>
                  </div>
                  <div className={styles.checked} onClick={() => {this.goBack(record.id)}}>
                    <span>选择</span>
                  </div>
                </div>
              </div>
            )
          })
        }
        <div className={styles.addAddress} onClick={this.gotoAddAddress}>
          <div style={{fontSize: '50px'}}>+</div>
          <div>添加新地址</div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const addressList = mineSelector.getUserAddressList(state)
  console.log("addressList:", addressList)
  return {
    addressList: addressList,
  }
}

const mapDispatchToProps = {
  ...mineAction,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SelectAddress))