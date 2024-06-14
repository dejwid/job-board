import Hero from "@/app/components/Hero";
import Jobs from "@/app/components/Jobs";
import {addOrgAndUserData, JobModel} from "@/models/Job";
import {getUser} from "@workos-inc/authkit-nextjs";
import mongoose from "mongoose";

export default async function Home() {
  const {user} = await getUser();
  await mongoose.connect(process.env.MONGO_URI as string);
  const latestJobs = await addOrgAndUserData(
    await JobModel.find({},{},{limit:5,sort:'-createdAt'}),
    user,
  );
  return (
    <>
      <Hero />
      <Jobs header={''} jobs={latestJobs} />
    </>
  );
}
