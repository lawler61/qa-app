import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { InputItem, WhiteSpace, Toast, Button } from 'antd-mobile'
import PageModal from 'components/PageModal'
import { getRandomImg, increaseCount } from 'utils'
import { ACCEPT_EXTS, DELAY_TIME } from 'common'
import { IRootStore, IRootAction } from 'typings'
import SettingPage from './Setting'
import DetailPage from './Detail'
import AboutPage from './About'

import './index.scss'

@inject(injector)
@observer
export default class User extends React.Component<IProps, IState> {
  static defaultProps = {
    prefixCls: 'page-user',
  }

  state = {
    answerNum: 0,
    askNum: 0,
    scoreNum: 0,
    imageKey: '',
    detailPageModal: false,
    settingPageModal: false,
    aboutPageModal: false,
  }

  curCover = getRandomImg() // cover 只能获取一次，不然在 render 时就会发生闪动

  imgInput: any

  async componentDidMount() {
    const { action, store } = this.props

    await action!.getUserData()

    const {
      todos: { length: answer },
      posts: { length: ask },
      score,
      cover,
    } = store!.data

    if (cover) {
      this.curCover = cover
    }

    this.loadNumAnimation({ answer, ask, score })
  }

  loadNumAnimation = (numObj: { answer: number; ask: number; score: number }) => {
    Object.keys(numObj).forEach(type => {
      increaseCount(numObj[type], (count, next) => this.setState({ [`${type}Num`]: count }, next))
    })
  }

  handleInputClick = (imageKey: string, event: any) => {
    // console.log(event.target.nodeName)
    const { nodeName } = event.target

    event.stopPropagation()

    if (!['I', 'DIV'].includes(nodeName)) {
      return
    }

    this.setState({ imageKey })
    this.imgInput.click()
  }

  handleFileChange = (event: any) => {
    const { files } = event.target
    const { action } = this.props
    const { imageKey } = this.state
    console.log(files[0])

    const { type } = files[0]

    if (!ACCEPT_EXTS.includes(type)) {
      Toast.fail('不支持该文件类型！')

      return
    }

    action!.uploadFile(files[0], imageKey, (success: boolean) => {
      success ? Toast.success('上传成功！', DELAY_TIME) : Toast.fail('上传失败！', DELAY_TIME)
    })
  }

  handleEdit = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation()

    this.setState({ detailPageModal: true })
  }

  handleModalShow = (type: string) => {
    this.setState({ [type]: true })
  }

  handleModalClose = (type: string) => {
    this.setState({ [type]: false })
  }

  handleSubmit = () => {
    const { action } = this.props

    action!.submitUserData((success: boolean) => {
      success ? Toast.success('修改成功！', DELAY_TIME) : Toast.fail('修改失败！', DELAY_TIME)
    })
  }

  render() {
    const { prefixCls, store } = this.props
    const { askNum, answerNum, scoreNum, detailPageModal, settingPageModal, aboutPageModal } = this.state

    const { data, loading } = store!

    // TODO: loading 组件
    if (loading) {
      // return <h1>正在加载...</h1>
      return (
        <React.Fragment>
          <h1>正在加载...</h1>
          <Button type="warning" onClick={this.props.action!.cancel}>
            取消
          </Button>
        </React.Fragment>
      )
    }

    const { name, profile, avatar } = data

    return (
      <div className={prefixCls}>
        <div
          className={`${prefixCls}-header`}
          style={{ backgroundImage: `url(${this.curCover})` }}
          onClick={event => this.handleInputClick('cover', event)}
        >
          <div className="edit" onClick={this.handleEdit}>
            编辑
          </div>
          <div className="main">
            <div className="main-avatar">
              <img src={avatar} alt="user-avatar" />
              <i
                className="fa fa-pencil change-icon"
                aria-hidden="true"
                onClick={event => this.handleInputClick('avatar', event)}
              />
            </div>
            <span className="main-username">{name}</span>
            <span className="main-profile">{profile}</span>
          </div>
          <input
            type="file"
            accept="image/*"
            ref={(node: React.ReactNode) => (this.imgInput = node)}
            onChange={this.handleFileChange}
          />
        </div>
        <ul className={`${prefixCls}-nav qa-border-1px-top`}>
          <li>
            <span className="nav-num">{answerNum}</span>
            <span className="nav-title">回答</span>
          </li>
          <li>
            <span className="nav-num">{askNum}</span>
            <span className="nav-title">提问</span>
          </li>
          <li>
            <span className="nav-num">{scoreNum}</span>
            <span className="nav-title">积分</span>
          </li>
        </ul>

        <WhiteSpace size="lg" />
        <div className={`${prefixCls}-extra`}>
          <InputItem
            className="qa-input-item user-input"
            value="我的动态"
            editable={false}
            extra={<i className="fa fa-angle-right fa-3x" aria-hidden="true" />}
            onClick={() => console.log('item click')}
          >
            <i className="fa fa-paper-plane-o warning" aria-hidden="true" />
          </InputItem>
          <InputItem
            className="qa-input-item user-input"
            value="我的关注"
            editable={false}
            extra={<i className="fa fa-angle-right fa-3x" aria-hidden="true" />}
            onClick={() => console.log('item click')}
          >
            <i className="fa fa-bullseye error" aria-hidden="true" />
          </InputItem>
          <InputItem
            className="qa-input-item user-input"
            value="意见反馈"
            editable={false}
            extra={<i className="fa fa-angle-right fa-3x" aria-hidden="true" />}
            onClick={() => console.log('item click')}
          >
            <i className="fa fa-file-text-o info" aria-hidden="true" />
          </InputItem>
          <InputItem
            className="qa-input-item user-input"
            value="设置"
            editable={false}
            extra={<i className="fa fa-angle-right fa-3x" aria-hidden="true" />}
            onClick={() => this.handleModalShow('settingPageModal')}
          >
            <i className="fa fa-cog" aria-hidden="true" />
          </InputItem>
          <InputItem
            className="qa-input-item user-input"
            value="关于我"
            editable={false}
            extra={<i className="fa fa-angle-right fa-3x" aria-hidden="true" />}
            onClick={() => this.handleModalShow('aboutPageModal')}
          >
            <i className="fa fa-smile-o blue" aria-hidden="true" />
          </InputItem>
        </div>
        <PageModal visible={detailPageModal}>
          <DetailPage onCancel={() => this.handleModalClose('detailPageModal')} onOK={this.handleSubmit} />
        </PageModal>
        <PageModal visible={settingPageModal}>
          <SettingPage onCancel={() => this.handleModalClose('settingPageModal')} onOK={this.handleSubmit} />
        </PageModal>
        <PageModal visible={aboutPageModal}>
          <AboutPage onCancel={() => this.handleModalClose('aboutPageModal')} />
        </PageModal>
      </div>
    )
  }
}

type injectorReturnType = ReturnType<typeof injector>

interface IProps extends Partial<injectorReturnType> {
  prefixCls?: string
  [k: string]: any
}

interface IState extends Partial<injectorReturnType> {
  answerNum: number
  askNum: number
  scoreNum: number
  imageKey: string
  detailPageModal: boolean
  settingPageModal: boolean
  aboutPageModal: boolean
}

function injector({ rootStore, rootAction }: { rootStore: IRootStore; rootAction: IRootAction }) {
  return {
    store: rootStore.User.userStore,
    action: rootAction.User.userAction,
  }
}
