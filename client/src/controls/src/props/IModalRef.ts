﻿export default interface IModalRef {
    /**
     * Opens modal with buttons in props
     * */
    open: () => void;
    /**
     * Closes current modal
     * */
    close: () => void;
}