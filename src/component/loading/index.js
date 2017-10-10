/**
 * Created by yangyang on 2017/10/10.
 */
import React from 'react'

export default class Loading extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div style={{height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <img src={require("../../asset/gif/loading.gif")} />
      </div>
    )
  }
}