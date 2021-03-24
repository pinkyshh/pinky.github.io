import { useState, useEffect } from 'react'
import { Button, Modal } from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Select from 'react-select'
import { format } from 'date-fns'
import { BsPlus, BsTrash, BsPencil } from "react-icons/bs";
import { useForm } from "react-hook-form"

// Firebase
import { useCollectionData } from 'react-firebase-hooks/firestore';
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

if (firebase.apps.length === 0) {
  firebase.initializeApp({
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
  })
}
const firestore = firebase.firestore()
const auth = firebase.auth()


// const data = require('./sampleData.json')

export default function Journal() {
  const { register, handleSubmit } = useForm()
  const [showForm, setShowForm] = useState(false)
  const [records, setRecords] = useState([])
  const [total, setTotal] = useState(0)
  const [editMode, setEditMode] = useState(false)
  const [tempData, setTempData] = useState({
    name: '',
    phone: '',
    reason:'',
    arr: '',
    dep: '',
    createdAt: new Date(),
  })

  // Firebase stuff
  const SPRRef = firestore.collection('SPR');
  const query = SPRRef.orderBy('createdAt', 'asc').limitToLast(100);
  const [data] = useCollectionData(query, { idField: 'id' });


  console.log("REACT_APP_PROJECT_ID", process.env.REACT_APP_PROJECT_ID)

  // This will be run when 'data' is changed.
  useEffect(() => {
    if (data) { // Guard condition
      let t = 0
      let r = data.map((d, i) => {
        // console.log('useEffect', format(d.createdAt.toDate(), "yyyy-MM-dd"))
        t += d.amount
        return (
          <JournalRow
            data={d}
            i={i}
            onDeleteClick={handleDeleteClick}
            onEditClick={handleEditClick}
          />
        )
      })

      setRecords(r)
    }
  },
    [data])


  // Handlers for Modal Add Form
  const handleshowForm = () => setShowForm(true)

  // Handlers for Modal Add Form
  const handleCloseForm = () => {
    setTempData({
      name: '',
      phone: '',
      reason:'',
      arr: '',
      dep: '',
      createdAt: new Date(),
    })
    setShowForm(false)
  }

  // Handle Add Form submit
  const onSubmit = async (data) => {
    let preparedData = {
      // ...data,
      name: data.name,
      phone: data.phone,
      reason:data.reason,
      arr: data.arr,
      dep: data.dep,
      createdAt: new Date(data.createdAt),
    }
    console.log('onSubmit', preparedData)


    if (editMode) {
      // Update record
      console.log("UPDATING!!!!", data.id)
      await SPRRef.doc(data.id)
        .set(preparedData)
        .then(() => console.log("SPRRef has been set"))
        .catch((error) => {
          console.error("Error: ", error);
          alert(error)
        });
    } else {
      // Add to firebase
      // This is asynchronous operation, 
      // JS will continue process later, so we can set "callback" function
      // so the callback functions will be called when firebase finishes.
      // Usually, the function is called "then / error / catch".
      await SPRRef
        .add(preparedData)
        .then(() => console.log("New record has been added."))
        .catch((error) => {
          console.error("Errror:", error)
          alert(error)
        })
      // setShowForm(false)
    }
    handleCloseForm()
  }

  const handleDeleteClick = (id) => {
    console.log('handleDeleteClick in Journal', id)
    if (window.confirm("Are you sure to delete this record?"))
      SPRRef.doc(id).delete()
  }

  const handleEditClick = (data) => {
    let preparedData = {
      name: data.name,
      phone: data.phone,
      reason:data.reason,
      arr: data.arr,
      dep: data.dep,
      createdAt: new Date(data.createdAt),
    }
    console.log("handleEditClick", preparedData)
    // expect original data type for data.createdAt is Firebase's timestamp
    // convert to JS Date object and put it to the same field
    // if ('toDate' in data.createdAt) // guard, check wther toDate() is available in createdAt object.
    //   data.createdAt = data.createdAt.toDate()

    setTempData(preparedData)
    setShowForm(true)
    setEditMode(true)
  }


  return (
    <Container>
      <Row>
        <Col>
          <h1>Form & Report</h1>
          <Button variant="outline-dark" onClick={handleshowForm}>
            <BsPlus /> Add
      </Button>
        </Col>

      </Row>

      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>#</th>
            <th>Date Created</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Arrival</th>
            <th>Departure</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {records}
        </tbody>
        <tfooter>
        </tfooter>
      </Table>


      <Modal
        show={showForm} onHide={handleCloseForm}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="hidden"
            placeholder="ID"
            ref={register({ required: false })}
            name="id"
            id="id"
            defaultValue={tempData.id}
          />
          <Modal.Header closeButton>
            <Modal.Title>
              {editMode ? "Edit Record" : "Add New Record"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col>
                <label htmlFor="createdAt">Date</label>
              </Col>
              <Col>
                <input
                  type="date"
                  placeholder="Date"
                  ref={register({ required: true })}
                  name="createdAt"
                  id="createdAt"
                  defaultValue={format(tempData.createdAt, "yyyy-MM-dd")}
                />

              </Col>
            </Row>
            <Row>
              <Col>
                <label htmlFor="name">Name</label>
              </Col>
              <Col>
                <input
                  type="text"
                  placeholder="name"
                  ref={register({ required: true })}
                  name="name"
                  id="name"
                  defaultValue={tempData.name}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <label htmlFor="phone">Phone Number</label>
              </Col>
              <Col>
                <input
                  type="text"
                  placeholder="phone"
                  ref={register({ required: true })}
                  name="phone"
                  id="phone"
                  defaultValue={tempData.phone}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <label htmlFor="arr">Arrival</label>
              </Col>
              <Col>
                <input
                  type="time"
                  placeholder="arr"
                  ref={register({ required: true })}
                  name="arr"
                  id="arr"
                  defaultValue={tempData.arr}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <label htmlFor="dep">Departure</label>
              </Col>
              <Col>
                <input
                  type="time"
                  placeholder="dep"
                  ref={register({ required: true })}
                  name="dep"
                  id="dep"
                  defaultValue={tempData.dep}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <label htmlFor="reason">Reason</label>
              </Col>
              <Col>
                <input
                  type="text"
                  placeholder="reason"
                  ref={register({ required: true })}
                  name="reason"
                  id="reason"
                  defaultValue={tempData.reason}
                />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseForm}>
              Close
          </Button>
            <Button variant={editMode ? "success" : "primary"} type="submit">
              {editMode ? "Save Record" : "Add Record"}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </Container>
  )
}

function JournalRow(props) {
  let d = props.data
  let i = props.i
  // console.log("JournalRow", d)
  return (
    <tr>
      <td>
        <BsTrash onClick={() => props.onDeleteClick(d.id)} />
      </td>
      <td>{format(d.createdAt.toDate(), "yyyy-MM-dd")}</td>
      <td>{d.name}</td>
      <td>{d.phone}</td>
      <td>{d.arr}</td>
      <td>{d.dep}</td>
      <td>{d.reason}</td>
    </tr>
  )
}