"use client";
import {
  instructorColumns,
  InstructorData,
} from "@/_config/instructorConfig";
import { DataTable } from "@/_elements/dataTable";
import { Filter } from "@/_elements/filter";
import { useLoading } from "@/_elements/loadingScreen";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchInstructorsActions } from "./registration/actions";
import { notify } from "@/lib/notifications";


export default function InstructorsPage() {
 const router = useRouter();
   const [instructors, setInstructors] = useState<InstructorData[]>();
   const { startLoading, stopLoading } = useLoading();
 
   const fetchStudents = async () => {
     try {
       startLoading("Loading documents...");
 
       const result = await fetchInstructorsActions();
 
       if (!result.success) {
         notify.error(result.message as any);
         console.error(result.message as any);
         return;
       }
       setInstructors(result.data);
     } catch (error) {
      
       notify.error(error as any);
       console.error("Failed to fetch students:", error);
     } finally {
       stopLoading();
     }
   };
   useEffect(() => {
     fetchStudents();
   }, []);
 
   return (
     <div className="p-6">
       <div className="flex flex-col gap-4 ">
         <div className="flex items-center gap-2">
           <Filter placeholder="Search student by" filterBy={instructorColumns} />
           <Button
             onClick={() => {
               router.push("/instructors/registration");
             }}
           >
             Add Instructor
           </Button>
         </div>
         <DataTable columns={instructorColumns} data={instructors ?? []} rowKey="id" />
       </div>
     </div>
   );
}
