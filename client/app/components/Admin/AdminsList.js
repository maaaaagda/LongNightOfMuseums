import React from 'react';
import {connect} from 'react-redux';
import {Table, Button} from 'semantic-ui-react';


class AdminsList extends React.Component
{
    constructor(props)
    {
        super(props);
    }
    renderAdminsList () {
      let adminsList = [];
      this.props.admins.map((admin, i) => {
        let adminDetail =  (
          <Table.Row key={i}>
            <Table.Cell>{admin.name}</Table.Cell>
            <Table.Cell>{admin.last_name}</Table.Cell>
            <Table.Cell>{admin.created_at}</Table.Cell>
            <Table.Cell>{admin.email}</Table.Cell>
            <Table.Cell>
              <Button inverted color='red'>
                Remove
              </Button>
            </Table.Cell>
          </Table.Row>
        );
        adminsList.push(adminDetail)
      });
      return adminsList;
    }

    renderAdminTable () {
      let adminTable = this.props.admins.length !== 0 ?
        (
          <div>
            <Table selectable size='large'>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Last name</Table.HeaderCell>
                  <Table.HeaderCell>Date joined</Table.HeaderCell>
                  <Table.HeaderCell>E-mail</Table.HeaderCell>
                  <Table.HeaderCell></Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                { this.renderAdminsList() }
              </Table.Body>
            </Table>
          </div>
        )
        :
        <div> No data available </div>;

      return adminTable;
    }

    render()
    {
        return (
          <div className='jumbotron-top-small'>
            <h1> List of all administrators </h1>
            { this.renderAdminTable() }
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
