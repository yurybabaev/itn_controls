import React from 'react';
import { Add,  HelpOutline } from "@mui/icons-material";
import { Box, Button, Tooltip, Typography } from '@mui/material';
import { IPageTitleProps } from '../props/IPageTitleProps';

const PageTitle = (props: IPageTitleProps) => {
    return <Box
        justifyContent='space-between'
        alignItems='center'
        display='flex'
        mb={2}
    >
        <Box display='flex' gap={2} alignItems='center'>
            <Typography variant='h5'>{props.children}</Typography>
            {
                props.tooltip !== null &&
                <Tooltip
                    title={props.tooltip}
                >
                    <HelpOutline
                        sx={theme => ({
                            cursor: "pointer",
                            ":hover": {
                                color: theme.palette.secondary.main
                            }
                        })}
                    />
                </Tooltip>
            }
        </Box>
        <Box display='flex' gap={2} alignItems='center'>
            {props.headerComponent}
            {
                props.onAdd &&
                <Button
                    color='secondary'
                    variant={props.btnVariant}
                    startIcon={<Add />}
                    onClick={props.onAdd}
                >
                    Создать
                </Button>
            }
        </Box>
    </Box>
}

PageTitle.defaultProps = {
    onAdd: null,
    headerComponent: null,
    tooltip: null,
    btnVariant: 'contained'
}

export default PageTitle;