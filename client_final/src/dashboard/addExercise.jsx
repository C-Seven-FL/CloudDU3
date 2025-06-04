import React, { Component } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import FetchHelper from '../fetch-helper';

const exercises = ['Push Ups', 'Squats', 'Lifting', 'Marathon', 'Swimming'];

class AddExercise extends Component {
    constructor(props) {
        super(props);
        this.state = {
        exercise: exercises[0],
        sets: '',
        reps: '',
        weight: '',
        duration: '00:00:00',
        distance: '',
        loading: false
        };
    }

    handleSubmit = async () => {
        const { exercise, sets, reps, weight, duration, distance } = this.state;
        const { workout } = this.props;
        if (!sets.trim() || isNaN(sets)) return alert("Sets must be a number");

        this.setState({ loading: true });
        try {
            const result = await FetchHelper.exercise.add({
            wrecordID: workout.id,
            name: exercise,
            sets: parseInt(sets),
            reps: reps !== '' ? parseInt(reps) : null,
            weight: weight !== '' ? parseFloat(weight) : null,
            duration: (duration !== '' && duration !== '00:00:00')  ? duration : null,
            distance: distance !== '' ? parseFloat(distance) : null,
            });
      // console.log(result);

        if (result.ok) {
            this.props.onCreated(workout.id, result.data.id);
        } 

        else {
            alert("Error");
        }} 

        catch (err) {
            console.error(err);
            alert("Error");
        } 

        finally {
        this.setState({ loading: false });
        }};

    render() {
        const { show, onHide } = this.props;
        const { exercise, sets, reps, weight, duration, distance, loading } = this.state;

        return (
            <Modal show={show} onHide={onHide} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add Exercise</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>

                        <Form.Group>
                            <Form.Label>Exercise</Form.Label>
                                <Form.Select
                                    value={exercise}
                                    onChange={e => this.setState({ exercise: e.target.value })}>
                                    {exercises.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </Form.Select>
                        </Form.Group>

                        <Form.Group className="mt-2">
                            <Form.Label>Sets</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={sets}
                                    onChange={e => this.setState({ sets: e.target.value })}/>
                        </Form.Group>

                        <Form.Group className="mt-2">
                            <Form.Label>Reps</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={reps}
                                    onChange={e => this.setState({ reps: e.target.value })}/>
                        </Form.Group>

                        <Form.Group className="mt-2">
                            <Form.Label>Weight (kg)</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.1"
                                    value={weight}
                                    onChange={e => this.setState({ weight: e.target.value })}/>
                        </Form.Group>

                        <Form.Group className="mt-2">
                            <Form.Label>Duration (hh:mm:ss)</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={duration}
                                    onChange={e => this.setState({ duration: e.target.value })}/>
                        </Form.Group>

                        <Form.Group className="mt-2">
                            <Form.Label>Distance (m)</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.1"
                                    value={distance}
                                    onChange={e => this.setState({ distance: e.target.value })}/>
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
                        disabled={loading || !sets.trim()}>
                        {loading ? 'Saving' : 'Add Exercise'}
                    </Button>

                </Modal.Footer>

            </Modal>
            );
        }
    }

export default AddExercise;
