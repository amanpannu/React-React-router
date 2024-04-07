import { 
  Outlet, 
  NavLink,
  useLoaderData, 
  useNavigation,
  Form, 
  redirect,
  useSubmit
} from "react-router-dom";

import { getContacts, createContact } from "../contacts";
import { useEffect } from "react";

export async function loadContacts({request}) {
    //const contacts = await getContacts();
    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    const contacts = await getContacts(q);
    return { contacts, q };
}

export async function action() {
  const contact = await createContact();
  //return { contact };
  return redirect(`/contacts/${contact.id}/edit`);
}

export default function Root() {

  const { contacts, q } = useLoaderData();
  const navigaion = useNavigation();

  const submit = useSubmit();

  const searching = 
    navigaion.location && 
    new URLSearchParams(navigaion.location.search).has("q");

  useEffect(() => {
    document.getElementById("q").value = q;
  }, [q]);

    return (
      <>
        <div id="sidebar">
          <h1>React Router Contacts</h1>
          <div>
            <Form id="search-form" role="search">
              <input
                id="q"
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
                defaultValue={q}
                className={searching ? "loading" : ""}
                onChange={(event) => {
                  const isFirstSearch = q == null;
                  submit(event.currentTarget.form, {
                    replace: !isFirstSearch,
                  });
                }}
              />
              <div
                id="search-spinner"
                aria-hidden
                hidden={!searching}
              />
              <div
                className="sr-only"
                aria-live="polite"
              ></div>
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
            {/* <ul>
              <li>
                <Link to={`/contacts/1`}>Your Name</Link>
              </li>
              <li>
                <Link to={`/contacts/2`}>Your Friend</Link>
              </li>
            </ul> */}

          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    to={`contacts/${contact.id}`}
                    className={navigaion.state === "loading" ? " loading" : ""}>
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
          </nav>
        </div>
        <div id="detail">
            <Outlet/>
        </div>
      </>
    );
  }