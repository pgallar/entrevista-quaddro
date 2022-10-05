import { useLoaderData, Link, Form, useSearchParams } from "@remix-run/react";
import { Appointment } from "../models"
import { getAppointments, checkDateTimeAvailable } from "../api/appointment"
import { json  } from "@remix-run/node";
import HeaderTableSortable from "../shared/components/HeaderTableSortable"
import TimeFormatted from "../shared/components/TimeFormatted"

export const loader = async ({ request }) => {
  const url = new URL(request.url)
  const deleted = url.searchParams.get("deleted")
  const orderBy = url.searchParams.get("orderBy")
  const filter = url.searchParams.get("filter")
  const orderDirection = (url.searchParams.get("orderDirection") == null || url.searchParams.get("orderDirection") === 'asc')

  const appointments = await getAppointments(
    (orderBy??'title') as keyof Appointment,
    orderDirection,
    filter
  )

  return json({ orderDirection, orderBy, deleted, appointments })
}

export default function Index() {
  const { orderDirection, orderBy, deleted, appointments } = useLoaderData()
  const [params] = useSearchParams()

  return (
    <div>
      <h1 className="text-center">Appointments</h1>
      <div className="d-flex flex-row col-5 mb-5">
        <div className="m-2">
          <Link to="/new" className="btn btn-success p-2">New appointment</Link>
        </div>
        <div className="m-1">
          <Form className="d-flex flex-row">
            <input type="text" name="filter" className="form-control p-2 pl-2 m-1" placeholder="Search appointments..." defaultValue={params.get("filter")} />
            <button className="btn btn-info m-1">Search</button>
          </Form>
        </div>
      </div>
      {deleted &&
        <div className="alert alert-warning alert-dismissible fade show col-4" role="alert">
          <strong>Appointment deleted successful</strong>
        </div>
      }
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <HeaderTableSortable name="Title" orderBy="title" orderDirection={orderDirection} currOrder={orderBy} />
            <HeaderTableSortable name="Date" orderBy="date" orderDirection={orderDirection} currOrder={orderBy} />
            <HeaderTableSortable name="Time start" orderBy="time_start" orderDirection={orderDirection} currOrder={orderBy} />
            <HeaderTableSortable name="Time end" orderBy="time_end" orderDirection={orderDirection} currOrder={orderBy} />
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(appointments as Appointment[])?.map((appointment) =>
            <tr key={appointment.id}>
              <td>{appointment.id}</td>
              <td>{appointment.title}</td>
              <td>{appointment.date?.toString()}</td>
              <td><TimeFormatted datetime={appointment.time_start} /></td>
              <td><TimeFormatted datetime={appointment.time_end} /></td>
              <td>
                <Link to={'/delete/'+appointment.id}>Delete</Link></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className='error-container'>
      <h1>😱 App Error</h1>
      <pre>❗ {error.message}</pre>
    </div>
  )
}