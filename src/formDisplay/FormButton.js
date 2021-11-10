import React from 'react'
// import Form from './Form'
import '../App.css'
import Form from './Formik'

const FormButton = () => {
  const [showForm, setShowForm] = React.useState(false)
  const onClick = () => setShowForm(true)

  return (
    <div className = "button">
      <input type = "submit" value = "Form" onClick = {onClick}/>
      {showForm ? <Form/> : null}
    </div>
  )
}

export default FormButton
