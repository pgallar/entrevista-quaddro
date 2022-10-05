import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { deleteAppointment } from "../../api/appointment"

export async function loader({ params }) {

  await deleteAppointment(params.appointmentId)

  return redirect('/?deleted=true')
}

export default function Delete(appointmentId) {
  const actionData = useLoaderData();

  return
}
