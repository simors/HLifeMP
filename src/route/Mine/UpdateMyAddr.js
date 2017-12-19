/**
 * Created by lilu on 2017/12/3.
 */

import {createForm} from 'rc-form';

import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import Avatar from '../../component/avatar'
import {Button, WingBlank, InputItem, List, Toast, Icon} from 'antd-mobile'
import {authSelector} from '../../util/auth'
import {mineAction, mineSelector} from '../../route/Mine/redux'
import Loading from '../../component/loading'
import RegionPicker from '../../component/common/RegionPicker'

import styles from './createMyAddr.module.scss'

class UpdateMyAddr extends React.PureComponent {
  constructor(props) {
    super(props)
    document.title = '更新收货地址'

    this.state = {
      showCusInput: false,
      province: undefined,
      city: undefined,
      district: undefined,
      tag: '',
      isCus: false
    }
    this.customFocusInst = 'ttt'
  }

  componentWillMount() {
    let {addr} = this.props
    if(addr.tag=='家'||addr.tag=='公司'||addr.tag=='学校'){
      this.setState({tag: addr.tag})
    }else{
      this.setState({tag: addr.tag,isCus:true})

    }

  }

  componentWillReceiveProps(newProps) {

  }

  submit = ()=> {
    this.props.form.validateFields((error, value) => {


      let payload = {
        addrId:this.props.addr.id,
        username: value.username,
        mobilePhoneNumber: value.mobilePhoneNumber,
        addr: value.addr,
        province: this.state.province,
        city: this.state.city,
        district: this.state.district,
        tag: this.state.tag,
        success: ()=>{this.props.history.goBack()},
        error: (err)=>{Toast.fail(err.message)}
      }
      if(payload.addrId!=''&&payload.username!=''&&payload.mobilePhoneNumber!=''&&payload.addr!=''&&payload.province!=''&&payload.city!=''&&payload.district!=''&&payload.tag!=''){
        this.props.updateMyAddr(payload)
      }else{
        Toast.fail('请填写全部内容！')
      }


      console.log(error, value);
    });
  }


  renderTagBox() {
    return (
      <div className={styles.tagBox}>
        <span className={styles.tagLabel}>标签:</span>
        <div className={styles.tagWrapBox}>
          <div className={styles.tagWrap}>
            <div className={this.state.tag == '家' ? styles.selectedTag : styles.tag} onClick={()=> {
              this.setState({isCus: false,tag: '家', showCusInput: false})
            }}>家
            </div>
            <div className={this.state.tag == '公司' ? styles.selectedTag : styles.tag} onClick={()=> {
              this.setState({isCus: false,tag: '公司', showCusInput: false})
            }}>公司
            </div>
            <div className={this.state.tag == '学校' ? styles.selectedTag : styles.tag} onClick={()=> {
              this.setState({isCus: false,tag: '学校', showCusInput: false})
            }}>学校
            </div>
          </div>
          <div className={styles.tagWrap}>
            <div className={this.state.isCus ? styles.selectedTag : styles.cusTag} onClick={()=> {
              this.setState({tag:'',isCus: true, showCusInput: true}, ()=> {
                this.handleClick()
              })
            }}>
              {(this.state.isCus&&this.state.tag!='') ? this.state.tag : <img className={styles.tagIcon} src={require('../../asset/image/add_tag@2x.png')}/>}
            </div>
            {this.state.showCusInput ?
              <div className={styles.inputBox}>
                <input ref="myInput" className={styles.input} onChange={(e)=> {
                  this.changeTag(e)
                }}/>
                <div className={styles.confirm} onClick={()=> {
                  this.setState({showCusInput: false})
                }}>确认
                </div>
              </div>
              : null}
          </div>
        </div>
      </div>
    )
  }

  changeTag(e){
    let text = e.target.value
    if(text&&text.length<4){
      this.setState({tag: text})
    }else{
      Toast.fail('字数不能大于3')
    }
  }

  handleClick() {
    // 使用原生的 DOM API 获取焦点
    console.log('refs=============>', this.refs)
    this.refs.myInput.focus();
  }

  render() {
    const {getFieldProps} = this.props.form;
    let {addr} = this.props

    return (
      <div className={styles.body}>
        <div className={styles.inputBox}>
          <span className={styles.inputLabel}>收货人:</span>
          <input className={styles.input} {...getFieldProps('username', {
            initialValue: addr.username
          })}/>
        </div>
        <div className={styles.inputBox}>
          <span className={styles.inputLabel}>联系电话:</span>
          <input className={styles.input} {...getFieldProps('mobilePhoneNumber', {
            initialValue: addr.mobilePhoneNumber
          })}/>
        </div>

        <RegionPicker className = {styles.picker} selectedAddr={[addr.province, addr.city, addr.district]} level={3} onOk={(value)=> {
          this.setState({province: value[0], city: value[1], district: value[2]})
        }}/>
        <div className={styles.inputBox}>
          <span className={styles.inputLabel}>详细地址:</span>
          <input className={styles.input} {...getFieldProps('addr', {
            initialValue: addr.addr
          })}/>
        </div>

        {this.renderTagBox()}

        <div className={styles.submit} onClick={this.submit}>保存</div>
      </div>
    )
  }
}


const mapStateToProps = (state, ownProps) => {
  let {match} = ownProps
  let {addrId} = match.params

  let addr = mineSelector.getUserAddress(state, addrId)

  console.log('addr=====>', addr)
  return {
    addr: addr
  }
}

const mapDispatchToProps = {
  ...mineAction,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(createForm()(UpdateMyAddr)))




