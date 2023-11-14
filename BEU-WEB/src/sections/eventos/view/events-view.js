'use client';

import isEqual from 'lodash/isEqual';
import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
// @mui
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
// auth
import { AuthContext } from 'src/auth/context/jwt/auth-context';
import { useContext } from 'react';
// _mock
import { EVENT_CATEGORY_OPTIONS, EVENT_STATE_OPTIONS } from 'src/_mock';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// api
import { useGetEvents, deleteEvent, searchEvents } from 'src/api/event';
// components
import { useSettingsContext } from 'src/components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSnackbar } from 'src/components/snackbar';
//
import EventTableRow from '../event-table-row';
import EventTableToolbar from '../event-table-toolbar';
import EventTableFiltersResult from '../event-table-filters-result';
import { TimeClock } from '@mui/x-date-pickers';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Evento', width: 700 },
  { id: 'createdStart', label: 'Fecha Inicio', width: 180 },
  { id: 'createdEnd', label: 'Fecha Fin', width: 180 },
  { id: 'capacity', label: 'Capacidad', width: 180 },
  { id: 'location', label: 'Ubicación', width: 1400 },
  { id: 'state', label: 'Estado', width: 130 },
  { id: '', width: 50 },
];

const defaultFilters = {
  name: '',
  state: [],
  category: [],
};

// ----------------------------------------------------------------------

export default function EventsView() {
  const router = useRouter();

  const table = useTable();

  const settings = useSettingsContext();

  const [tableData, setTableData] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);

  const { user } = useContext(AuthContext);

  const { events, eventsLoading, eventsEmpty } = user?.center == 'CGC' || user?.center == 'CJFD' || user?.center == 'CAPS' || user?.center == 'CFICC' || user?.center == 'CPSFJ' ? searchEvents(user?.center) : useGetEvents();
   
  const confirmDelete = useBoolean();

  const confirmPublish = useBoolean();

  const methods = useForm(); 
  const { enqueueSnackbar } = useSnackbar();


  useEffect(() => {
    if (events.length) {
      setTableData(events);
    }
  }, [events]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 60 : 80;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || eventsEmpty;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        await deleteEvent(id);
        setTableData((prevData) => prevData.filter((event) => event.id !== id));

        enqueueSnackbar('¡Eliminación Exitosa!');
        console.info('DATA', id);
      } catch (error) {
        setTableData((prevData) => [...prevData, tableData.find((event) => event.id === id)]);
        console.error('Error al eliminar el evento:', error);
        enqueueSnackbar('Error al eliminar el evento', { variant: 'error' });
      }
    },
    [enqueueSnackbar, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.eventos.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.eventos.details(id));
    },
    [router]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Eventos"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            {
              name: 'Eventos',
              href: paths.dashboard.eventos,
            },
          ]}
          action={
            <Button
              color="primary"
              component={RouterLink}
              href="/dashboard/eventos/new"
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Nuevo Evento
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          
          <EventTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            categoryOptions={EVENT_CATEGORY_OPTIONS}
            stateOptions={EVENT_STATE_OPTIONS}
          />

          {canReset && (
            <EventTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Eliminar">
                  <IconButton color="error" onClick={confirmDelete.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
              publish={
                <Tooltip title="Publicar">
                  <IconButton color="primary" onClick={confirmPublish.onTrue}>
                    <Iconify icon="material-symbols:publish" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {eventsLoading ? (
                    [...Array(table.rowsPerPage)].map((i, index) => (
                      <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    ))
                  ) : (
                    <>
                      {dataFiltered
                        .slice(
                          table.page * table.rowsPerPage,
                          table.page * table.rowsPerPage + table.rowsPerPage
                        )
                        .map((row) => (
                          <EventTableRow
                            key={row.id}
                            row={row}
                            selected={table.selected.includes(row.id)}
                            onSelectRow={() => table.onSelectRow(row.id)}
                            onDeleteRow={() => handleDeleteRow(row.id)}
                            onEditRow={() => handleEditRow(row.id)}
                            onViewRow={() => handleViewRow(row.id)}
                          />
                        ))}
                    </>
                  )}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={confirmDelete.value}
        onClose={confirmDelete.onFalse}
        title="Eliminar"
        content={
          <>
            ¿Estás seguro que quieres eliminar <strong> {table.selected.length} </strong> eventos?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirmDelete.onFalse();
            }}
          >
            Eliminar
          </Button>
        }
      />

      <ConfirmDialog
        open={confirmPublish.value}
        onClose={confirmPublish.onFalse}
        title="Publicar"
        content={
          <>
            ¿Estás seguro que quieres publicar <strong> {table.selected.length} </strong> eventos?
          </>
        }
        action={
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              // FUNCION PARA PUBLICAR
              confirmPublish.onFalse();
            }}
          >
            Publicar
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { name, category, state } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (event) => event.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (category.length) {
    inputData = inputData.filter((event) => category.includes(event.category));
  }

  if (state.length) {
    inputData = inputData.filter((event) => state.includes(event.state));
  }

  return inputData;
}
