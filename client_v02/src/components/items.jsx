import React, { Component } from 'react'
import { ListGroup } from 'react-bootstrap';
import Item from './item'
import FetchHelper from '../fetch-helper'

export class Items extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            expandedItems: {}, 
            loadedExercises: {} 
            };}

    handleToggle = async (item) => {
        const {id, exerciseID} = item;

        this.setState(prev => ({
            expandedItems: {
            ...prev.expandedItems,
            [id]: !prev.expandedItems[id]
            }
        }));

        // Если уже загружено — не повторяем
        if (!this.state.loadedExercises[id] && exerciseID.length > 0) {
            try {
            const result = await Promise.all(
                exerciseID.map(eid => FetchHelper.exercise.get({ id: eid }))
            );

            const exercises = result
                .filter(r => r.ok)
                .map(r => r.data);

            this.setState(prev => ({
                loadedExercises: {
                ...prev.loadedExercises,
                [id]: exercises
                }
            }));
            } catch (err) {
            console.error("Error:", err);
            }
        }
        };

    render() {
        return (
        <div className="container mt-3">
            <h4>Workout records for: </h4>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            <ListGroup>

                {this.props.items.map(el => (

                    <ListGroup.Item
                    key={el.id}
                    onClick={() => this.handleToggle(el)}
                    style={{cursor: 'pointer'}}
                    >

                    <div className="d-flex justify-content-between align-items-center">
                        <strong>{el.name}</strong>
                        <small>{new Date(el.date).toLocaleDateString()}</small>
                    </div>

                    {this.state.expandedItems[el.id] && (
                        <div className="mt-2 ps-3">
                        {this.state.loadedExercises[el.id] ? this.state.loadedExercises[el.id].map(ex => (
                                <div key={ex.id}>

                                <b>{ex.name}</b>
                                {ex.sets     != null && `, ${ex.sets} sets`}
                                {ex.reps     != null && `, ${ex.reps} reps`}
                                {ex.weight   != null && `, ${ex.weight} kg`}
                                {ex.duration != null && `, deuration: ${ex.duration}`}
                                {ex.distance != null && `, distance: ${ex.distance}`}

                                </div>
                            )) : <small>Loading...</small>}
                        </div>
                    )}

                    </ListGroup.Item>

                ))}

                </ListGroup>
            </div>
        </div>
        );
    }
    }

export default Items;