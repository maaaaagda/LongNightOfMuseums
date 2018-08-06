import {Button, Modal} from "semantic-ui-react";
import React from "react";

class CustomModal extends React.Component {
  constructor(props) {
    super(props);
    this.renderModal = this.renderModal.bind(this);
    this.hideModalAndPerformAction = this.hideModalAndPerformAction.bind(this);
  }

  hideModalAndPerformAction() {
    this.props.hideModal();
    this.props.performAction();
  }

  renderModal() {
    let result;
    switch (this.props.modalType) {
      case 'confirm':
        result = (
          <Modal size='small' open={true} onClose={this.props.hideModal} >
            <Modal.Header>{this.props.header}</Modal.Header>
            <Modal.Content>
              <p>{this.props.content}</p>
            </Modal.Content>
            <Modal.Actions>
              <Button color='black' onClick={this.props.hideModal}>Cancel</Button>
              <Button color='green' inverted onClick={this.hideModalAndPerformAction}>Yes</Button>
            </Modal.Actions>
          </Modal>
        );
        break;
      case 'simple':
        result = (
          <Modal size='small' open={true} onClose={this.props.hideModal}>
            <Modal.Header>{this.props.header}</Modal.Header>
            <Modal.Content>
              <p>{this.props.content}</p>
            </Modal.Content>
            <Modal.Actions>
              <Button color='black' onClick={this.props.hideModal}>Cancel</Button>
            </Modal.Actions>
          </Modal>
        );
        break;
      case 'extraAction':
        result = (
          <Modal size='small' open={true} onClose={this.props.hideModal}>
            <Modal.Header>{this.props.header}</Modal.Header>
            <Modal.Content>
              <p>{this.props.content}</p>
            </Modal.Content>
            <Modal.Actions>
              <Button color='black' onClick={this.hideModal}>Cancel</Button>
              {this.props.performAction ? (
                  <Button color='green' inverted onClick={this.hideModalAndPerformAction}>
                    {this.props.performActionTitle}
                  </Button> )
              : ""}
            </Modal.Actions>
          </Modal>
        );
        break;
    }
    return result;

  }
  render () {
    return (
      this.renderModal()
    )
  }


}

export default CustomModal;
