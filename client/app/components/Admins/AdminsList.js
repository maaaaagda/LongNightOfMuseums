import React from 'react';
import {connect} from 'react-redux';
import {Table, Button, Segment, Dimmer, Loader} from 'semantic-ui-react';
import {delete_admin, load_admins} from "../../store/actions/adminActions";
import {Link} from "react-router-dom";
import CustomModal from '../Helpers/Modals';
import moment from "moment";
import history from "../../helpers/history";

class AdminsList extends React.Component
{
    constructor(props)
    {
      super(props);
      this.state = {
        isFormLoading: false,
        modal: '',
        loadingData: false
      };
      this.hideModal = this.hideModal.bind(this);
    }

    componentDidMount() {
      if(this.props.admins.length === 0) {
        this.setState({loadingData: true});
        this.props.dispatch(load_admins())
          .then(() => {
            this.setState({loadingData: false})
          })
      }

    }
    ensureDeletingUser(id) {
     let confirmModal = (
       <CustomModal
        modalType='confirm'
        header='Remove administrator'
        content='Are you sure you want to delete administrator?'
        hideModal={this.hideModal}
        performAction={() => {this.deleteUser(id)}}
      />
    );
      this.showModal(confirmModal);
    }
    showModal(modal) {
      this.setState({ modal: modal });
    }
    hideModal() {
      this.setState({ modal: '' })
    }

    formatDate(date){
      return moment(date, moment.ISO_8601).format("DD.MM.YYYY  HH:mm")
    }
    editAdmin(id) {
      history.push({pathname: '/admin/admins/'+id});
    }

    deleteUser(id) {
      this.props.dispatch(delete_admin(id))
        .then(() => {
          let successModal = (
            <CustomModal
              modalType='simple'
              header='Operation completed successfully'
              content='Administrator deleted successfully.'
              hideModal={this.hideModal}
            />);
          this.showModal(successModal);
        })
        .catch((err) => {
          let errorModal = (
            <CustomModal
              modalType='simple'
              header='Operation failed'
              content={err.response.data.message || 'Something went wrong, unable to delete selected administrator'}
              hideModal={this.hideModal}
            />);
          this.showModal(errorModal);
        })
    }

    renderAdminsList () {
      let adminsList = [];
      this.props.admins.map((admin, i) => {
        let adminDetail =  (
          <Table.Row key={i}>
            <Table.Cell>{admin.name}</Table.Cell>
            <Table.Cell>{admin.last_name}</Table.Cell>
            <Table.Cell>{this.formatDate(admin.created_at)}</Table.Cell>
            <Table.Cell>{admin.email}</Table.Cell>
            <Table.Cell>{admin.role}</Table.Cell>
            <Table.Cell>
              <div className='museum-button'>
                <Button basic color='red' onClick={() => this.ensureDeletingUser(admin._id)}>
                  Remove
                </Button>
              </div>
              <div className='museum-button'>
                <Button basic color='blue' onClick={() => this.editAdmin(admin._id)}>
                  Edit
                </Button>
              </div>
            </Table.Cell>
          </Table.Row>
        );
        adminsList.push(adminDetail)
      });
      return adminsList;
    }

    renderAdminTable () {
      let adminTable = (
          <div className={'table-container'}>
            <Table selectable size='large' unstackable={true}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Last name</Table.HeaderCell>
                  <Table.HeaderCell>Date joined</Table.HeaderCell>
                  <Table.HeaderCell>E-mail</Table.HeaderCell>
                  <Table.HeaderCell>Role </Table.HeaderCell>
                  <Table.HeaderCell/>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                { this.renderAdminsList() }
              </Table.Body>
            </Table>
          </div>
        );
      if(this.state.loadingData){
        return <div className='jumbotron-fully-centered'>
          <Dimmer active inverted>
            <Loader inverted>Loading...</Loader>
          </Dimmer>
        </div>
      }
      if(this.props.admins.length === 0 ) {
        return <div className='jumbotron-fully-centered'> No data available </div>;
      }
      return adminTable;
    }

  render() {
    return (
      <div className={'main-container'}>
        <div className='jumbotron-padding-y-small'>
          <Segment.Group horizontal>
            <Segment textAlign='left'><h1> List of all administrators </h1></Segment>
            <Segment textAlign='right' as={Link} to={"/admin/admins/new"}>
              <Button color='black'>
                Add new administrator
              </Button>
            </Segment>
          </Segment.Group>
          <br/>
          {this.renderAdminTable()}
          {this.state.modal}
        </div>
      </div>
    )
  }

}

function mapStateToProps(state)
{
    return {
      admins: state.admins
    }
}

export default connect(mapStateToProps)(AdminsList);
