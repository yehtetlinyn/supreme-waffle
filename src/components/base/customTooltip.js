import { Button, UncontrolledPopover, PopoverBody } from "reactstrap";
import customStyle from "./style.module.css";
import styles from "@/components/styles/commonStyles.module.css";
import { AiOutlineInfoCircle } from "react-icons/ai";

const CustomTooltip = ({
  children,
  tooltipId,
  btnProps,
  placement = "top",
  regularInfo = false,
  errorInfo = false,
}) => {
  return (
    <div>
      <div className={customStyle.tooltipBorder}></div>
      {regularInfo && (
        <Button
          type="button"
          className={customStyle.tooltipBtn}
          id={`popover${tooltipId}`}
        >
          {btnProps}
        </Button>
      )}

      {errorInfo && (
        <AiOutlineInfoCircle
          id={`popover${tooltipId}`}
          size={24}
          color="var(--text-red)"
          className={styles.pointer}
        />
      )}

      <UncontrolledPopover
        placement={placement}
        target={`popover${tooltipId}`}
        trigger="legacy"
      >
        <PopoverBody>{children}</PopoverBody>
      </UncontrolledPopover>
    </div>
  );
};

export default CustomTooltip;
