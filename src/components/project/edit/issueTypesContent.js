import useProjectStore from "@/store/project";
import React, { useEffect } from "react";
import { shallow } from "zustand/shallow";

import projectStyles from "../project.module.css";

import { IoIosAddCircle } from "react-icons/io";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import IssueTypesView from "./issueTypesView";
import IssueTypesEdit from "./issueTypesEdit";

const IssueTypesCotent = () => {
  const params = useParams();
  const router = useRouter();
  const mode = params.action;
  const { issueCount } = useProjectStore(
    (state) => ({
      issueCount: state.issueCount,
    }),
    shallow
  );

  if (mode === "view") {
    if (issueCount > 0) {
      return <IssueTypesView />;
    } else {
      return (
        <div
          className={projectStyles.addressInsertBox}
          style={{ padding: 100 }}
          onClick={() => {
            router.replace(
              `/settings/project/edit/${params.id}?tab=issueTypes`
            );
          }}
        >
          <IoIosAddCircle />
          Nothing to display at the moment. Start by adding a new entry using
          the button .
        </div>
      );
    }
  } else if (mode === "edit") {
    return <IssueTypesEdit />;
  }
};

export default IssueTypesCotent;
