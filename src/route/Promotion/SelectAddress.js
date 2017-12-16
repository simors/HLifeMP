/**
 * Created by wanpeng on 2017/12/9.
 */
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import {mineAction, mineSelector} from '../Mine'
import styles from './selectaddress.module.scss'
import {Icon} from 'antd-mobile'

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

  componentWillReceiveProps(newProps) {
    if(newProps.defaultAddress.id != this.state.defaultAddressId) {
      this.setState({defaultAddressId: newProps.defaultAddress.id})
    }
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
    const {history, location, setDefaultAddr, defaultAddress} = this.props
    const {state} = location
    var {metadata} = state
    if(defaultAddress.id != this.state.defaultAddressId) {
      setDefaultAddr({addrId: addressId})
    }
    history.push('/submitOrder', {metadata: metadata, addressId: addressId})
  }

  setDefaultAddress(addressId) {
    if(addressId != this.state.defaultAddressId) {
      this.setState({defaultAddressId: addressId})
    }
  }

  render() {
    const {addressList} = this.props
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
                      <Icon type={require('../../asset/svg/edite@100x.svg')} alt=""
                           style={{width: '0.5rem', height: '0.5rem'}} onClick={() => this.gotoUpdateAddress(record.id)}/>
                    </div>
                  </div>
                  <div className={styles.address}>{record.addr}</div>
                </div>
                <div className={styles.op}>
                  <div className={styles.default}>
                    <Icon type={this.state.defaultAddressId === record.id? require('../../asset/svg/selected@100x.svg'): require('../../asset/svg/select@100x.svg')} alt=""
                         style={{width: '0.5rem', height: '0.5rem'}} onClick={() => this.setDefaultAddress(record.id)}/>
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
  const defaultAddress = mineSelector.getDefaultAddress(state)
  return {
    addressList: addressList,
    defaultAddress: defaultAddress,
  }
}

const mapDispatchToProps = {
  ...mineAction,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SelectAddress))