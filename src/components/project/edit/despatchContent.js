import useProjectStore from "@/store/project";
import React from "react";
import { shallow } from "zustand/shallow";

import projectStyles from "../project.module.css";

import DespatchView from "./despatchView";
import { IoIosAddCircle } from "react-icons/io";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import DespatchEdit from "./despatchEdit";
import { useEffect } from "react";

const DespatchContent = () => {
  const params = useParams();
  const router = useRouter();
  const mode = params.action;
  const { despatchCount } = useProjectStore(
    (state) => ({
      despatchCount: state.despatchCount,
    }),
    shallow
  );

  if (mode === "view") {
    if (despatchCount > 0) {
      return <DespatchView />;
    } else {
      return (
        <div
          className={projectStyles.addressInsertBox}
          style={{ padding: 100 }}
          onClick={() => {
            router.replace(
              `/settings/project/edit/${params.id}?tab=despatchTypes`
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
    return <DespatchEdit />;
  }
};

export default DespatchContent;
