import { ActionFunction, redirect, json } from "@remix-run/node";
import { Link, useActionData } from "@remix-run/react";
import { addAppointment, checkDateTimeAvailable } from "../api/appointment"

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const title = formData.get('title')
  const date = formData.get('date')
  const time_start = formData.get('time_start')
  const time_end = formData.get('time_end')
  const date_start = (new Date(date + ' ' + time_start +'+00:00')).toISOString()
  const date_end = (new Date(date + ' ' + time_end +'+00:00')).toISOString()
  const values = Object.fromEntries(formData);
  let errors = { title: '', date: '', time_end: '' }
  let errorsFound = false

  // Check if time start collapse with another appointment
  let appointmentFound = await checkDateTimeAvailable(date, date_start, date_end)

  if (appointmentFound?.length && appointmentFound[0].total > 0) {
    errorsFound = true
    errors.date = "Another appointment found with the same datetime"
  }

  if (!date) {
    errorsFound = true
    errors.date = "Please select date"
  }

  if (!title) {
    errorsFound = true
    errors.title = "Title is required"
  }

  if (date_end <= date_start) {
    errorsFound = true
    errors.time_end = "The time selected mus be grater than start"
  }

  if (errorsFound) {
    return json({ errors, values })
  }

  await addAppointment(title, date, date_start, date_end)

  return redirect('.')
}

export default function New() {
  const minDate = new Date().toISOString().replace(/\T.+/, '')
  const actionData = useActionData();

  return (
    <div className="col-6">
      <h1>New appointment</h1>
      <form action='#' method='post'>
        <div className="mb-3">
          <label htmlFor='' className="form-label">Title</label>
          <br />
          <input type='text' name='title' className="form-control" defaultValue={actionData?.values.title} required />
          {actionData?.errors.title ? (
              <div>
                <span className="badge text-bg-danger">
                  {actionData.errors.title}
                </span>
              </div>
            ) : null}
        </div>
        <div className="mb-3 col-4">
          <label htmlFor='' className="form-label">Date</label>
          <br />
          <input type='date' name='date' className="form-control" min={minDate} defaultValue={actionData?.values.date} required />
          {actionData?.errors.date ? (
              <div>
                <span className="badge text-bg-danger">
                  {actionData.errors.date}
                </span>
              </div>
            ) : null}
        </div>
        <div className="row">
          <div className="mb-3 col-3">
            <label htmlFor='' className="form-label">Start</label>
            <br />
            <input type='time' name='time_start' className="form-control" defaultValue={actionData?.values.time_start} required />
          </div>
          <div className="mb-3 col-3">
            <label htmlFor='' className="form-label">End</label>
            <br />
            <input type='time' name='time_end' className="form-control" defaultValue={actionData?.values.time_end} required />
          </div>
          {actionData?.errors.time_end ? (
              <div>
                <span className="badge text-bg-danger">
                  {actionData.errors.time_end}
                </span>
              </div>
            ) : null}
        </div>
        <div className="row">
          <div className="col-2">
            <button type='submit' className="btn btn-primary">
              Save
            </button>
          </div>
          <div className="col-2">
            <Link
              to={'/'}
              className="btn btn-danger"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
