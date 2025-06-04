import React, { Component } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import FetchHelper from '../fetch-helper';

class CreateWorkout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            notes: '',
            loading: false
        };
    }

    handleSubmit = async () => {
        const { name, notes } = this.state;
        const { onCreated, onHide, record } = this.props;
        this.setState({ loading: true });

        try {
            let result;

            if (record && record.id) {
                result = await FetchHelper.wrecord.update({
                    id: record.id,
                    name,
                    notes,
            });} 
        
            else {
                result = await FetchHelper.wrecord.create({
                    name,
                    notes,
                    date: new Date().toISOString(),
            });}

            if (result.ok) {
                onCreated();
                onHide();
            } 
            
            else {
                alert("Error");
            }} 
            
            catch (err) {
                console.error(err);
                alert("Error");} 
                
            finally {
                this.setState({ loading: false });}};

            componentDidUpdate(prevProps) {
                if (!prevProps.show && this.props.show && this.props.record) {
                    const { name, notes } = this.props.record;
                    this.setState({
                        name,
                        notes,
                        loading: false
                    });}

                if (!prevProps.show && this.props.show && !this.props.record) {
                    this.setState({
                        name: '',
                        notes: '',
                        loading: false
                    });}}

    render() {
        const { show, onHide } = this.props;
        const { name, notes, loading } = this.state;

        return (
            <Modal show={show} onHide={onHide} centered>

                <Modal.Header closeButton>
                    <Modal.Title>{this.props.record ? 'Edit Workout Record' : 'Create Workout Record'}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>

                        <Form.Group>
                            <Form.Label>Name of workout</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={name}
                                    onChange={e => this.setState({ name: e.target.value })}/>
                        </Form.Group>

                        <Form.Group className="mt-3">
                            <Form.Label>Notes</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    value={notes}
                                    onChange={e => this.setState({ notes: e.target.value })}/>
                        </Form.Group>

                    </Form>
                </Modal.Body>

                <Modal.Footer>

                    <Button 
                        variant="secondary" 
                        onClick={onHide}
                        >Cancel
                    </Button>

                    <Button
                        variant="primary"
                        onClick={this.handleSubmit}
                        disabled={loading || name.trim() === ''}>
                        {loading ? (this.props.record ? 'Saving' : 'Creating') : (this.props.record ? 'Save' : 'Create')}
                    </Button>

                </Modal.Footer>
            </Modal>);}}

export default CreateWorkout;