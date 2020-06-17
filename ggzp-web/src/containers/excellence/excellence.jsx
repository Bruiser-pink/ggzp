import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getUserListInfo} from '../../redux/actions'
import UserList from "../../components/user-list/user-list"
class Excellence extends Component {
  //获取数据
  componentDidMount() {
    this.props.getUserListInfo('boss')
  }
  render () {
    return (
      <UserList userlist = {this.props.userlist}></UserList>
    )
  }
}

export default connect(
  state => ({userlist: state.UserList}),
  {getUserListInfo}
)(Excellence)