import React from 'react'
import { Button } from 'react-bootstrap';
import FetchHelper from '../fetch-helper'
import WorkoutList from './workoutList';
import CreateWorkout from './createWorkout';
import AddExercise from './addExercise';

export class Items extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            expandedItems: {}, 
            loadedExercises: {},
            items: [],
            selectedYear: new Date().getFullYear(),
            showModal: false,
            editModalVisible: false,
            recordToEdit: null,
            selectedWorkoutRecord: null,
            showAddExerciseModal: false,
            workoutForNewExercise: null
        }}
        
    handleAddExercise = (record) => {
        this.setState({
            workoutForNewExercise: record,
            showAddExerciseModal: true
        })}

    handleExerciseAdded = async (recordId, exerciseID) => {

        if (!exerciseID) {
            console.warn("Received undefined exerciseID, skipping reload.");
            return;
        }
        // if (!this.state.loadedExercises[recordId]) return;

        const result = await Promise.all(
            [exerciseID].map(id => FetchHelper.exercise.get({ id }))
        );

        const newExercises = result.filter(r => r.ok).map(r => r.data);
        const previous = this.state.loadedExercises[recordId] || [];
        const exercises = [...previous, ...newExercises];

        this.setState(prev => ({
            loadedExercises: {
            ...prev.loadedExercises,
            [recordId]: exercises
            }
        }))}

    handleExerciseUpdated = async (exerciseId) => {
        if (!exerciseId) return;
        const res = await FetchHelper.exercise.get({ id: exerciseId });
        if (!res.ok) return;

        const updated = res.data;
        this.setState(prev => {
            const list = prev.loadedExercises[updated.wrecordID] || [];
            const updatedList = list.map(e => e.id === updated.id ? updated : e);
            return {
            loadedExercises: {
                ...prev.loadedExercises,
                [updated.wrecordID]: updatedList
        }}})}

    handleExerciseDeleted = (exercise) => {
        const recordId = exercise.wrecordID;
        if (!recordId) return;

        this.setState(prev => {
            const current = prev.loadedExercises[recordId] || [];
            return {
            loadedExercises: {
                ...prev.loadedExercises,
                [recordId]: current.filter(ex => ex.id !== exercise.id),
            },
            showExerciseModal: false,
            selectedExercise: null,
        }})}

    handleEditRecord = (record) => {
        this.setState({
            recordToEdit: record,
            editModalVisible: true
        })}

    componentDidMount() {this.loadWorkoutRecords(this.state.selectedYear);}

    loadWorkoutRecords = async (year) => {
        const result = await FetchHelper.wrecord.load({ daterate: "year", year });
        if (result.ok) {
            this.setState({ items: result.data, selectedYear: year });
        } else {
            console.error("Load error:", result.status);
        }}

    handleToggle = async (item) => {
        const {id, exerciseID} = item;
        this.setState(prev => ({
            expandedItems: {
            ...prev.expandedItems,
            [id]: !prev.expandedItems[id]
            }
        }))

        if (!this.state.loadedExercises[id] && exerciseID.length > 0) {
            const result = await Promise.all(
                exerciseID.map(eid => FetchHelper.exercise.get({ id: eid }))
            );
            const exercises = result.filter(r => r.ok).map(r => r.data);
            this.setState(prev => ({
                loadedExercises: {
                ...prev.loadedExercises,
                [id]: exercises
                }}));}};


    render() {
        return (
            <div className="container mt-3">

                <div className="d-flex align-items-center mb-3">
                    <h4 className="me-3 mb-0">Workout records for:</h4>

                <select
                    className="form-select w-auto"
                    value={this.state.selectedYear}
                    onChange={(e) => this.loadWorkoutRecords(parseInt(e.target.value))}>
                    {[2030, 2029, 2028, 2027, 2026, 2025, 2024, 2023, 2022, 2021, 2020].map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}

                </select>

            </div>
            
            <Button className="mb-3" onClick={() => this.setState({ showModal: true })}>
            Add Workout
            </Button>
            
            <CreateWorkout
                show={this.state.showModal}
                onHide={() => this.setState({ showModal: false })}
                onCreated={() => this.loadWorkoutRecords(this.state.selectedYear)}
                editRecord={this.state.selectedWorkoutRecord}/>

            <CreateWorkout
                show={this.state.editModalVisible}
                onHide={() => this.setState({ editModalVisible: false, recordToEdit: null })}
                onCreated={() => {
                    this.loadWorkoutRecords(this.state.selectedYear);
                    this.setState({ editModalVisible: false, recordToEdit: null });
                }}
                mode="edit"
                record={this.state.recordToEdit}/>
                
            <AddExercise
                show={this.state.showAddExerciseModal}
                onHide={() =>
                    this.setState({ showAddExerciseModal: false, workoutForNewExercise: null })
                }
                workout={this.state.workoutForNewExercise}
                onCreated={this.handleExerciseAdded}/>

            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>

                <WorkoutList
                items={this.state.items}
                expandedItems={this.state.expandedItems}
                loadedExercises={this.state.loadedExercises}
                onToggle={this.handleToggle}
                onDelete={() => this.loadWorkoutRecords(this.state.selectedYear)}
                onEdit={this.handleEditRecord}
                onAddExercise={this.handleAddExercise}
                onExerciseDeleted={this.handleExerciseDeleted}
                onUpdated={this.handleExerciseUpdated}/>
            
            </div>
        </div>
        );
    }
    }

export default Items;