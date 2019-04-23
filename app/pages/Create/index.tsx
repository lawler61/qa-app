import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { IRootStore, IRootAction } from '../../typings'

import './index.scss'

import addQuestionIcon from '../../assets/images/addQuestion.png'

@inject(injector)
@observer
export default class Create extends React.Component<IProps, {}> {
  static defaultProps = {
    prefixCls: 'page-create',
  }

  constructor(props) {
    super(props)
  }

  // componentDidMount() {}

  render() {
    const { prefixCls } = this.props

    return (
      <div className={prefixCls}>
        <img src={addQuestionIcon} alt='' />
      </div>
    )
  }
}

type injectorReturnType = ReturnType<typeof injector>

interface IProps extends Partial<injectorReturnType> {
  prefixCls?: string
  [k: string]: any
}

function injector({
  rootStore,
  rootAction,
}: {
  rootStore: IRootStore
  rootAction: IRootAction,
}) {
  return {
    store: rootStore.Create,
    action: rootAction.Create,
  }
}