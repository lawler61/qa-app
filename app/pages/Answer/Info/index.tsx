import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { Button, WhiteSpace, Modal, ImagePicker } from 'antd-mobile'
import { increaseCount } from 'utils'
import { IRootStore, IRootAction } from 'typings'
import { TIME_OPTIONS, TYPE_OPTIONS } from 'common'

import './index.scss'
import PageHeader from 'components/PageHeader'
import { withRouter } from 'react-router'
import { IFile } from '../../Create/interface'

@inject(injector)
@observer
class Info extends React.Component<IProps, IState> {
  static defaultProps = {
    prefixCls: 'page-answer-info',
  }

  state = {
    imgModal: false,
    imgUrl: '',
    readNum: 0,
    unreadNum: 0,
  }

  componentDidMount() {
    const { read, unread } = this.props

    increaseCount(read, (count, next) => this.setState({ readNum: count }, next))
    increaseCount(unread, (count, next) => this.setState({ unreadNum: count }, next))
  }

  handleModalClose = (type: string) => {
    this.setState({ [type]: false })
  }

  handleImgClick = (index: number | undefined = 0, files: IFile[] | undefined = []) => {
    console.log(index, files)
    this.setState({
      imgUrl: files[index].url,
      imgModal: true,
    })
  }

  onBack = () => {
    const { onCancel, history } = this.props

    history.goBack()
    onCancel()
  }

  render() {
    const {
      prefixCls,
      title,
      type,
      date,
      content,
      cover,
      files,
      user: { name: author, avatar },
      showAuthor,
      expire,
      onOK,
      poster,
    } = this.props
    const { imgUrl, imgModal, readNum, unreadNum } = this.state

    return (
      <div className={prefixCls}>
        <PageHeader text="问题详情" onCancel={this.onBack} />
        <div className={`${prefixCls}-header qa-border-1px-bottom`}>
          <div className="header-content">
            <div className="title qa-text-ellipsis">{title}</div>
            <span className="type">{TYPE_OPTIONS.find(t => t.key === type)!.value}</span>
          </div>
          <div className="header-info">
            <img
              src={
                showAuthor
                  ? avatar
                  : 'https://avatars3.githubusercontent.com/u/38933451?s=400&u=fec40d54d423074a4c9d86dcc9bc8f042d7a2d0a&v=4'
              }
              alt="user-avatar"
            />
            <span className="info-name qa-border-1px-right">{showAuthor ? author : '匿名'}</span>
            <span className="info-date qa-border-1px-right">{(new Date(date)).toLocaleString().replace(/\//g, '-').slice(5, 13)}</span>
            <span className="info-expire">
              期限：
              {TIME_OPTIONS.find(t => t.key === expire)!.value}
            </span>
          </div>
        </div>
        <div className={`${prefixCls}-read`}>
          <div className="read-wrapper qa-border-1px-right">
            <span className="count-title">已读</span>
            <span className="count-number read">{readNum}</span>
          </div>
          <div className="read-wrapper">
            <span className="count-title">未读</span>
            <span className="count-number unread">{unreadNum}</span>
          </div>
        </div>
        <div className={`${prefixCls}-content`}>
          <img src={cover} alt="content-img" />
          <p>{content}</p>
          {files.length ? (
            <ImagePicker
              className="qa-image-picker info-img-picker qa-border-1px"
              files={files.filter(f => !f.cover)}
              length="5"
              onImageClick={this.handleImgClick}
              selectable={false}
            />
          ) : null}
        </div>
        <Button className="finish-question" onClick={onOK}>
          <i className="fa fa-paint-brush" aria-hidden="true" />
          <span>{`${poster ? '查看结果' : '完成问题'}`}</span>
        </Button>
        <Modal
          visible={imgModal}
          transparent
          onClose={() => this.handleModalClose('imgModal')}
          // animationType="fade"
          transitionName="am-zoom"
          className="qa-img-modal"
          // wrapProps={{ onTouchStart: this.onWrapTouchStart }}
        >
          <img src={imgUrl} alt="预览图片" />
        </Modal>
      </div>
    )
  }
}

type injectorReturnType = ReturnType<typeof injector>

interface IProps extends Partial<injectorReturnType> {
  prefixCls?: string
  title: string
  type: string
  date: string
  content: string
  cover: string
  files: IFile[]
  user: { name: string; avatar: string }
  expire: string
  read: number
  unread: number
  showAuthor: boolean
  onOK: () => void
  onCancel: () => void
  history: any
  poster: boolean
}

interface IState extends Partial<injectorReturnType> {
  imgModal: boolean
  imgUrl: string
  readNum: number
  unreadNum: number
}

function injector({ rootStore, rootAction }: { rootStore: IRootStore; rootAction: IRootAction }) {
  return {}
}

export default withRouter(Info)
