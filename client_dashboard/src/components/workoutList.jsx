import React, { Component } from 'react';
import { ListGroup, Card, Button } from 'react-bootstrap';
import ExerciseModal from './exerciseModal';
import FetchHelper from '../fetch-helper';

class WorkoutList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedExercise: null,
            showExerciseModal: false,
        };
    }

    handleExerciseClick = (exercise) => {
        this.setState({
            selectedExercise: exercise,
            showExerciseModal: true
        });
    };

    handleDeleteRecord = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

        try {
            const result = await FetchHelper.wrecord.delete({ id });
            if (result.ok) {

            if (this.props.onDelete) {
                this.props.onDelete();
            }} 
            
            else {
                alert("Error");
            }} 
            
            catch (err) {
                console.error("Delete error:", err);
                alert("Error")}
            }

    render() {
        const { items, expandedItems, loadedExercises, onToggle } = this.props;
        const { selectedExercise, showExerciseModal } = this.state;

        return (
            <ListGroup>
                {items.map(el => (
                    <ListGroup.Item
                        key={el.id}
                        onClick={() => onToggle(el)}
                        style={{ cursor: 'pointer' , backgroundColor: "#efedf8"}}>
                        <div className="d-flex justify-content-between align-items-center">
                            <strong>{el.name}</strong>
                            <small>{new Date(el.date).toLocaleDateString()}</small>
                        </div>

                {el.notes && (
                    <div className="mt-1 text-muted" style={{ fontSize: '0.9rem' }}>
                        {el.notes}
                    </div>
                )}

                {expandedItems[el.id] && (
                    <div className="mt-2 ps-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <div><strong>Exercises:</strong></div>

                                <Button
                                    variant="success"
                                    size="sm"
                                    className="ms-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        this.props.onAddExercise(el);
                                    }}
                                    >Add Exercise
                                </Button>

                                <Button
                                    variant="warning"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        this.props.onEdit(el);
                                    }}
                                    >Edit
                                </Button>

                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={(e) => {
                                    e.stopPropagation(); 
                                    this.handleDeleteRecord(el.id, el.name);
                                    }}
                                    >Delete
                                </Button>
                        </div>

                        {loadedExercises[el.id] ? loadedExercises[el.id].map(ex => (
                            <Card key={ex.id} className="mb-2" onClick={(e) => {
                                e.stopPropagation(); 
                                this.handleExerciseClick(ex);
                            }} 
                                style={{ cursor: 'pointer', backgroundColor: "#f4f4f6" }}>

                                <Card.Body>
                                    <Card.Title>{ex.name}</Card.Title>
                                    <Card.Text>
                                        {ex.sets != null && `${ex.sets} sets `}
                                        {ex.reps != null && `${ex.reps} reps `}
                                        {ex.weight != null && `${ex.weight} kg `}
                                        {ex.duration != null && `duration: ${ex.duration} `}
                                        {ex.distance != null && `distance: ${ex.distance}`}
                                    </Card.Text>
                                </Card.Body>

                            </Card>
                            )) : (<small>EMPTY</small>)}

                    </div>)}

                    </ListGroup.Item>))}

                    <ExerciseModal
                        show={showExerciseModal}
                        onHide={() => this.setState({ showExerciseModal: false })}
                        exercise={selectedExercise}
                        onDeleted={this.props.onExerciseDeleted}
                        onUpdated={this.props.onUpdated}/>

                </ListGroup>
            );
        }
    }

export default WorkoutList;