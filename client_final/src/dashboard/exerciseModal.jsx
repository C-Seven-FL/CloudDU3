import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import FetchHelper from '../fetch-helper';
import EditExercise from './editExercise';

class ExerciseModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
        };
    }

    handleDelete = async () => {
        const { exercise, onDeleted, onHide } = this.props;

        if (!exercise || !exercise.id) return;
        if (!window.confirm(`Delete "${exercise.name}"?`)) return;

        try {
            const result = await FetchHelper.exercise.delete({ id: exercise.id });
            if (result.ok) {
                onDeleted?.(exercise);
                onHide?.();
            } 
      
            else {
                alert("Error");
            }} 
            
            catch (err) {
                console.error("Delete error:", err);
                alert("Error");
            }};

    render() {
        const { show, onHide, exercise, workout } = this.props;
        if (!exercise) return null;
        // console.log(exercise)
        if (this.state.editing) {
            return (
                <EditExercise
                    show={this.state.editing}
                    onHide={() => this.setState({ editing: false })}
                    workout={workout}
                    exercise={exercise}
                    onUpdated={this.props.onUpdated}/>
            );
        }

        return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{exercise.name}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {exercise.sets != null && <p>Sets: {exercise.sets}</p>}
                {exercise.reps != null && <p>Reps: {exercise.reps}</p>}
                {exercise.weight != null && <p>Weight: {exercise.weight} kg</p>}
                {exercise.duration != null && <p>Duration: {exercise.duration}</p>}
                {exercise.distance != null && <p>Distance: {exercise.distance} m</p>}
            </Modal.Body>

            <Modal.Footer>

            <Button 
                variant="secondary" 
                onClick={onHide}
                >Close
            </Button>

            <Button 
                variant="warning" 
                onClick={() => this.setState({ editing: true })}
                >Edit
            </Button>

            <Button
                variant="danger"
                onClick={this.handleDelete}
                disabled={!exercise || !exercise.id}
                >Delete
            </Button>

            </Modal.Footer>
        </Modal>
        );
    }
}

export default ExerciseModal;