/**
 * Created by lilu on 2017/12/3.
 */


import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {Button, WingBlank , List, Picker} from 'antd-mobile'
import {appStateSelector} from '../../util/appstate'
import { createForm } from 'rc-form';
import styles from './regionPicker.module.scss'

class RegionPicker extends React.PureComponent {
  constructor(props) {
    super(props)
    this.pickerData = []
    this.generateArea()
  }

  componentDidMount() {
    this.generateArea()
  }

  componentWillReceiveProps(newProps) {
    this.generateArea()
  }

  updateInput(text) {
    this.props.onChange({data:{text}})
  }

  getPickerData(data) {
    if (!this.props.level) {
      return
    }
    let text = {}
    if (this.props.level == 1) {
      text = {
        province: data[0],
      }
    } else if (this.props.level == 2) {
      text = {
        province: data[0],
        city: data[1],
      }
    } else if (this.props.level == 3) {
      text = {
        province: data[0],
        city: data[1],
        district: data[2],
      }
    }
    this.updateInput(text)
  }

  generateArea() {
    let data = this.props.area
    console.log('data=========>',data,this.props.level)
    if (this.props.level == 1) {
      data.forEach((province) => {
        let area = {}
        area.label = province.area_name
        area.value = province.area_name
        this.pickerData.push(area)
      })
    } else if (this.props.level == 2) {
      data.forEach((province) => {
        let area = {}
        area.label = province.area_name
        let cities = []
        province.sub.forEach((city) => {
          let cityObj = {}
          cityObj.label = city.area_name
          cityObj.value = city.area_name
          cities.push(cityObj)
        })
        area.value = cities
        this.pickerData.push(area)
      })
    } else if (this.props.level == 3) {
      data.forEach((province) => {
        let area = {}
        area.label = province.area_name
        area.value = province.area_name
        let cities = []
        province.sub.forEach((city) => {
          let cityObj = {}
          cityObj.label = city.area_name
          cityObj.value = city.area_name
          let districts = []
          // 有某些城市不存在区
          if (city.sub && Array.isArray(city.sub)) {
            city.sub.forEach((district) => {
              let districtObj = {}
              districtObj.label = district.area_name
              districtObj.value = district.area_name
              districts.push(districtObj)
            })
            cityObj.children = districts
          } else {
            cityObj.children = []
          }
          cities.push(cityObj)
        })
        area.children = cities
        this.pickerData.push(area)
      })
    }
  }

  onOk=()=>{
    this.props.form.validateFields((error, value) => {
      console.log(error, value);
    });

  }



  render() {
    let {getFieldProps} = this.props.form


    return (
        <Picker
          className={styles.body}
          data={this.pickerData}
          {...getFieldProps('district', {
            initialValue: this.props.selectedAddr?this.props.selectedAddr:[],
          })}
          onOk={(e)=>{this.props.onOk(e)}}
          onDismiss={e => console.log('dismiss', e)}
        >
          <List.Item arrow="horizontal" onClick={this.onClick}>选择地区:</List.Item>
        </Picker>
    )
  }
}


const mapStateToProps = (state, ownProps) => {
  let area = appStateSelector.selectProvincesAndCities(state)
  return {
    area: area,
  }
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(createForm()(RegionPicker))
