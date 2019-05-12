import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import { InputItem, Button, Toast } from 'antd-mobile'
import debounce from '../../utils/debounce'
import lockIcon from '../../assets/images/lock.svg'
import { IResponse } from '../Register/actions/registerAction'
import { INoError } from './interface'
import { IRootStore, IRootAction } from '../../typings'

import './index.scss'

@inject(injector)
@observer
export default class Login extends React.Component<IProps, IState> {
  static defaultProps = {
    prefixCls: 'page-login',
  }

  accountInput: React.ReactNode

  passwordInput: React.ReactNode

  noErrors: INoError = { hasError: false, error: '' }

  state = {
    account: '',
    password: '',
    accountInfo: this.noErrors,
    loading: false,
  }

  handleChange = (type: string, val: string) => {
    this.setState({ [type]: val })
  }

  validateAccount = (val: string) => {
    // handle by debounce
    const { action } = this.props
    const { account } = this.state

    if (val.length < 6) {
      this.setState({
        accountInfo: { hasError: true, error: '账户名长度至少6位！' },
      })

      return
    }

    action!.validateAccount(account, (data: IResponse) => {
      data.status === 'success'
        ? this.setState({ accountInfo: this.noErrors })
        : this.setState({
            accountInfo: { hasError: true, error: '该账户名不存在！' },
          })
    })
  }

  handlePasswordChange = (val: string) => {
    this.setState({ password: val })
  }

  handleErrorClick = (type: string) => {
    const { [type]: info } = this.state
    Toast.fail(info.error)
    this[`${type.slice(0, -4)}Input`].focus()
  }

  handleSubmit = () => {
    const { action } = this.props
    const { account, password } = this.state

    if (!account || !password) {
      Toast.fail('请输入登录信息！')

      return
    }

    this.setState({ loading: true })

    action!.login({ account, password }, (data: IResponse) => {
      console.log(data)

      this.setState({ loading: false })
    })
  }

  render() {
    const { prefixCls } = this.props
    const { account, password, accountInfo, loading } = this.state

    const { hasError: accountErr } = accountInfo

    return (
      <div className={`${prefixCls} qa-login`}>
        <div className="qa-login-header">欢迎使用！</div>
        <div className="qa-login-main">
          <InputItem
            ref={(node: React.ReactNode) => (this.accountInput = node)}
            placeholder="请输入用户名或邮箱"
            value={account}
            maxLength={20}
            error={accountErr}
            onErrorClick={() => this.handleErrorClick('accountInfo')}
            onChange={debounce(this.validateAccount, (val: string) =>
              this.setState({ account: val })
            )}
          >
            <i className="fa fa-user-o fa-2x user-icon" aria-hidden="true" />
          </InputItem>
          <InputItem
            ref={(node: React.ReactNode) => (this.passwordInput = node)}
            type="password"
            placeholder="请输入密码"
            value={password}
            maxLength={20}
            onChange={this.handlePasswordChange}
          >
            <img src={lockIcon} className="password-icon" alt="password-icon" />
          </InputItem>
        </div>
        <div className="qa-login-footer">
          <Link to="/register" className="btn-login">
            注册
            <i className="fa fa-angle-right icon" aria-hidden="true" />
          </Link>
          {/* <Link >忘记密码</Link> */}
          <Button className="btn-login" activeClassName="btn-login-active">
            忘记密码
          </Button>
        </div>
        <Button
          type="primary"
          className="qa-btn-bottom"
          disabled={accountErr || loading}
          loading={loading}
          onClick={this.handleSubmit}
        >
          登录
        </Button>
      </div>
    )
  }
}

type injectorReturnType = ReturnType<typeof injector>

interface IProps extends Partial<injectorReturnType> {
  prefixCls?: string
}

interface IState extends Partial<injectorReturnType> {
  account: string
  password: string
  accountInfo: INoError
  loading: boolean
}

function injector({
  rootStore,
  rootAction,
}: {
  rootStore: IRootStore
  rootAction: IRootAction
}) {
  return {
    store: rootStore.Login.loginStore,
    action: rootAction.Login.loginAction,
  }
}
