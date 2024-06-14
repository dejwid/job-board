'use server';
import {createCompany} from "@/app/actions/workosActions";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {getUser} from "@workos-inc/authkit-nextjs";
import {WorkOS} from "@workos-inc/node";
import Link from "next/link";

export default async function NewListingPage() {

  const workos = new WorkOS(process.env.WORKOS_API_KEY);

  const {user} = await getUser();



  if (!user) {
    return (
      <div className="container">
        <div>You need to be logged in to post a job</div>
      </div>
    );
  }

  const organizationMemberships = await workos.userManagement.listOrganizationMemberships({
    userId: user.id,
  });

  const activeOrganizationMemberships = organizationMemberships.data.filter(om => om.status === 'active');
  const organizationsNames:{[key: string]: string} = {};
  for (const activeMembership of activeOrganizationMemberships) {
    const organization = await workos.organizations.getOrganization(activeMembership.organizationId);
    organizationsNames[organization.id] = organization.name;
  }


  return (
    <div className="container">
      <div>
        <h2 className="text-lg mt-6">Your companies</h2>
        <p className="text-gray-500 text-sm mb-2">Select a company to create a job add for</p>
        <div>
          <div className="border inline-block rounded-md">
            {Object.keys(organizationsNames).map(orgId => (
              <Link
                href={'/new-listing/' + orgId}
                className={
                  "py-2 px-4 flex gap-2 items-center "
                  + (Object.keys(organizationsNames)[0] === orgId ? '' : 'border-t')
                }>
                {organizationsNames[orgId]}
                <FontAwesomeIcon className="h-4" icon={faArrowRight} />
              </Link>
            ))}
          </div>
        </div>

        {organizationMemberships.data.length === 0 && (
          <div className="border border-blue-200 bg-blue-50 p-4 rounded-md">
            No companies found assigned to your user
          </div>
        )}

        <Link
          className="inline-flex gap-2 items-center bg-gray-200 px-4 py-2 rounded-md mt-6"
          href={'/new-company'}>
          Create a new company
          <FontAwesomeIcon className="h-4" icon={faArrowRight} />
        </Link>
      </div>
    </div>
  );
}