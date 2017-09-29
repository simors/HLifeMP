/**
 * Created by yangyang on 2017/9/29.
 */
import React from 'react'

/****************************************************************
 *
 * 数据格式：将所有组件中的数据组织为一个数组，每一个数组中数据结构如下：
 * {
 *    type: [COMP_TEXT | COMP_IMG],
 *    text: 当type为COMP_TEXT时有效，为<Text>元素中的文本内容
 *    url: 当type为COMP_IMG时有效，为<Image>元素的图片地址
 *    width: 当type为COMP_IMG时有效，表示图片的宽度
 *    height: 当type为COMP_IMG时有效，表示图片的高度
 * }
 *
 **/

const COMP_TEXT = 'COMP_TEXT'
const COMP_IMG = 'COMP_IMG'

export default class ArticleViewer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.images = []
  }

  componentDidMount() {
    this.props.artlcleContent.map((section) => {
      if (section.type === COMP_IMG) {
        this.images.push(section.url)
      }
    })
  }

  renderText(content, index) {
    return (
      <p key={index}>{content}</p>
    )
  }

  renderImage(url, width, height, index) {
    return (
      <div key={index}>
        <img src={url} width="100%" />
      </div>
    )
  }

  renderComponents() {
    return (
      this.props.artlcleContent.map((section, index) => {
        if (section.type === COMP_TEXT) {
          return this.renderText(section.text, index)
        } else if (section.type === COMP_IMG) {
          return this.renderImage(section.url, section.width, section.height, index)
        } else {
          return <div/>
        }
      })
    )
  }

  render() {
    return (
      <div>
        {this.renderComponents()}
      </div>
    )
  }
}