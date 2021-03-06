import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { InputItem, Button, Switch, ActionSheet, WhiteSpace } from 'antd-mobile'
import ConfirmModal from 'components/ConfirmModal'
import PageHeader from 'components/PageHeader'
import { DELAY_TIME } from 'common'
import { IRootStore, IRootAction } from 'typings'
import { renderSteps } from '../index'

import './index.scss'

@inject(injector)
@observer
export default class Extra extends React.Component<IProps, IState> {
  static defaultProps = {
    prefixCls: 'page-create-extra',
  }

  state = {
    type: { key: '', value: '' },
    time: { key: '', value: '' },
    // receivers: {},
    showAuthor: true,
    secret: false,
    anonymous: false,
    confirmModal: false,
  }

  async componentDidMount() {
    const { action } = this.props

    await action!.getDepsAndUsers()
  }

  showActionSheet = (actionType: string) => {
    const types: Array<{
      key: string
      value: string
    }> = require('common')[`${actionType.toUpperCase()}_OPTIONS`]

    ActionSheet.showActionSheetWithOptions(
      {
        options: types.map(type => type.value),
        message: `请选择${actionType === 'type' ? '问题类型' : '有效时间'}`,
        maskClosable: true,
        className: 'qa-action-sheet',
      },
      index => {
        if (index === -1) {
          return
        }

        this.setState({ [actionType]: types[index] })
      }
    )
  }

  handleModalShow = (type: string) => {
    this.setState({ [type]: true })
  }

  handleModalClose = (type: string) => {
    this.setState({ [type]: false })
  }

  handleSwitchChange = (type: string) => {
    this.setState({ [type]: !this.state[type] })
  }

  handleFinish = () => {
    const { onOK, action } = this.props
    const { type, time, showAuthor, secret, anonymous } = this.state

    this.handleModalClose('confirmModal')
    // if (!type.value || !time.value || !receivers) {
    //   Toast.fail('请检查以上内容!', DELAY_TIME)
    //   return
    // }

    action!.updateExtra(type.key, time.key, showAuthor, secret, anonymous)

    onOK()
    // this.handleModalClose('confirmModal')
  }

  render() {
    const { prefixCls, title, onCancel, onReceiver, store } = this.props
    const { type, time, showAuthor, secret, anonymous, confirmModal } = this.state

    const { receivers } = store!
    const receiversCount = Object.values(receivers).reduce((sum, dpt) => sum + dpt.count, 0)

    return (
      <div className={prefixCls}>
        <PageHeader text="其他信息" onCancel={onCancel} />
        {renderSteps(2)}
        <WhiteSpace size="lg" />
        <div className="page-create-header qa-border-1px-bottom">
          <span className="header-title">
            标题：
            {title}
          </span>
        </div>
        <div className={`${prefixCls}-main`}>
          <div className="content-title">
            {/* <div className="content-text">有效时间</div> */}
            <InputItem
              className="qa-input-item text-right"
              placeholder="请选择"
              value={type.value}
              maxLength={10}
              onClick={() => this.showActionSheet('type')}
              editable={false}
            >
              问题类型
            </InputItem>
          </div>
          <div className="content-title">
            <InputItem
              className="qa-input-item text-right"
              placeholder="请选择"
              value={time.value}
              maxLength={10}
              editable={false}
              onClick={() => this.showActionSheet('time')}
            >
              有效时间
            </InputItem>
          </div>
          <div className="content-title">
            <InputItem
              className="qa-input-item text-right"
              placeholder="请选择"
              value={receiversCount ? `已选择 ${receiversCount} 人` : '未选择答题人员'}
              maxLength={20}
              editable={false}
              onClick={onReceiver}
            >
              发送范围
            </InputItem>
          </div>
          <WhiteSpace size="lg" />
          <div className="page-create-header qa-border-1px-bottom">
            <span className="header-title">显示作者</span>
            <Switch checked={showAuthor} onChange={() => this.handleSwitchChange('showAuthor')} />
          </div>
          <div className="page-create-header qa-border-1px-bottom">
            <span className="header-title">设为保密</span>
            <Switch checked={secret} onChange={() => this.handleSwitchChange('secret')} />
          </div>
          <div className="page-create-header qa-border-1px-bottom">
            <span className="header-title">匿名回答</span>
            <Switch checked={anonymous} onChange={() => this.handleSwitchChange('anonymous')} />
          </div>
          <Button
            type="primary"
            className="qa-btn-bottom"
            disabled={!type.value || !time.value || !receiversCount}
            onClick={() => this.handleModalShow('confirmModal')}
          >
            添加完成
          </Button>
        </div>
        <ConfirmModal
          visible={confirmModal}
          onCancel={() => this.handleModalClose('confirmModal')}
          title="你确定提交问题吗？"
          onOK={this.handleFinish}
        />
      </div>
    )
  }
}

type injectorReturnType = ReturnType<typeof injector>

interface IProps extends Partial<injectorReturnType> {
  prefixCls?: string
  onOK: () => void
  onReceiver: () => void
  onCancel: () => void
}

interface IState extends Partial<injectorReturnType> {
  type: { key: string; value: string }
  time: { key: string; value: string }
  showAuthor: boolean
  secret: boolean
  anonymous: boolean
  confirmModal: boolean
}

function injector({ rootStore, rootAction }: { rootStore: IRootStore; rootAction: IRootAction }) {
  return {
    store: rootStore.Create.extraStore,
    action: rootAction.Create.extraAction,
    title: rootStore.Create.infoStore.title,
  }
}
