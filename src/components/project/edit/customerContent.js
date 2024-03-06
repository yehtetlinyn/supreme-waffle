import React, { useEffect } from "react";

import styles from "../project.module.css";
import commonStyles from "../../styles/commonStyles.module.css";
import { useState } from "react";
import TabContentFilter from "./tabContentFilter";
import { TbTrash } from "react-icons/tb";
import useCustomerStore from "@/store/customer";
import { shallow } from "zustand/shallow";
import Loading from "@/components/modals/loading";
import NoData from "@/components/noData/noData";
import Paginate from "@/components/pagination/page";
import { useParams, useSearchParams } from "next/navigation";
import CustomerTable from "./customerTable";
import { AiOutlinePlus } from "react-icons/ai";
import CustomerCreate from "./customerCreate";
import DeleteConfirmation from "@/components/modals/delete";
import { DELETE_CUSTOMER } from "@/graphql/mutations/customer";
import { useMutation } from "@apollo/client";
import apolloClient from "@/lib/apolloClient";
import useProjectStore from "@/store/project";

const CustomerContent = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const searchName = searchParams.get("name");

  const [selectedCustomer, setSelectedCustomer] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const [createModal, setCreateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const { getProjectByID } = useProjectStore(
    (state) => ({
      getProjectByID: state.getProjectByID,
    }),
    shallow
  );

  const { getCustomers, customerData, loading, total, pageCount } =
    useCustomerStore(
      (state) => ({
        getCustomers: state.getCustomers,
        customerData: state.customerData,
        loading: state.loading,
        total: state.total,
        pageCount: state.pageCount,
      }),
      shallow
    );
  // console.log("customerData", customerData, total, pageCount);

  const fetchRelatedCustomers = async () => {
    await getCustomers({
      customerName: searchName || undefined,
      projectID: params.id,
      currentPage: currentPage,
      pageSize: 10,
    });
  };

  useEffect(() => {
    fetchRelatedCustomers();
  }, [currentPage, searchName]);

  useEffect(() => {
    pageCount < currentPage && setCurrentPage(pageCount);
  }, [customerData]);

  const modalToggle = () => {
    setCreateModal(false);
  };

  const [deleteCustomerAction] = useMutation(DELETE_CUSTOMER, {
    client: apolloClient,
    onCompleted: (data) => {},
    onError: (error) => console.log("error", error),
  });

  const deleteToggle = () => {
    setSelectedCustomer([]);
    setDeleteModal(false);
  };

  const deleteCustomerHandler = async () => {
    try {
      await Promise.all(
        selectedCustomer?.map(async (customer) => {
          await deleteCustomerAction({
            variables: {
              id: customer.id,
            },
          });
        })
      );

      //Update project data by refetch project
      await getProjectByID({
        id: params?.id,
        deleted: false,
      });

      fetchRelatedCustomers();
      deleteToggle();
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      {deleteModal && (
        <DeleteConfirmation
          isOpen={deleteModal}
          toggle={deleteToggle}
          totalRows={selectedCustomer.length}
          selectedRow={
            selectedCustomer.length > 1
              ? `${selectedCustomer.length} users`
              : `${selectedCustomer[0]?.name}`
          }
          deleteHandler={deleteCustomerHandler}
        />
      )}
      <CustomerCreate isOpen={createModal} toggle={modalToggle} />
      <button
        type="button"
        style={{ marginLeft: "auto", marginBottom: 30 }}
        className={commonStyles.addBtn}
        onClick={() => setCreateModal(true)}
      >
        <AiOutlinePlus />
        Add Customer
      </button>
      <div className={styles.tabContentWrap}>
        <div className={styles.tabContentHeader}>
          <TabContentFilter
            reset={true}
            // createBtn
            // createText={"Add Participants"}
            // handleCreate={() => setAddUser(true)}
          />
          <div className={styles.tabContentSubtitle}>
            Total Customer Contacts
            <span>{total || 0}</span>
            {selectedCustomer.length > 0 && (
              <div
                onClick={() => setDeleteModal(true)}
                className={commonStyles.deleteBtn}
                style={{ marginLeft: "auto" }}
              >
                <TbTrash size={18} />
                Delete
              </div>
            )}
          </div>
        </div>
        {loading ? (
          <Loading />
        ) : customerData?.length === 0 ? (
          <div>
            <NoData />
          </div>
        ) : (
          <div style={{ overflow: "hidden scroll " }}>
            <CustomerTable
              tableData={customerData}
              selectedCustomer={selectedCustomer}
              setSelectedCustomer={setSelectedCustomer}
              setDeleteModal={setDeleteModal}
            />
          </div>
        )}
        <div className={styles.tabContentFooter} style={{ marginTop: "auto" }}>
          <span className={commonStyles.entriesText}>
            {`Showing ${customerData?.length} of ${total || 0} Entries`}
          </span>
          <Paginate
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageCount={pageCount}
          />
        </div>
      </div>
    </>
  );
};

export default CustomerContent;
