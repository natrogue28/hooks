import { fetchUtils, DataProvider, CreateResult, RaRecord, Identifier, DeleteManyParams, DeleteManyResult, GetManyParams, GetManyReferenceParams, GetManyReferenceResult, GetManyResult, QueryFunctionContext, UpdateManyParams, UpdateManyResult } from 'react-admin';
import { stringify } from 'query-string';

const apiUrl = 'http://localhost:4000';  // URL del backend
const httpClient = fetchUtils.fetchJson;

const dataProvider: DataProvider = {
    getList: (resource, params) => {
        const url = `${apiUrl}/${resource}`;
        return httpClient(url).then(({ json }) => ({
            data: json.map((record: any) => ({ ...record, id: record._id })),  // Mapea _id a id
            total: json.length,
        }));
    },

    getOne: (resource, params) => {
        const url = `${apiUrl}/${resource}/${params.id}`;
        return httpClient(url).then(({ json }) => ({
            data: { ...json, id: json._id },  // Mapea _id a id
        }));
    },

    create: <RecordType extends Omit<RaRecord, 'id'> = any, ResultRecordType extends RaRecord = RecordType & { id: Identifier; }>(
        resource: string,
        params: { data: RecordType; }
    ): Promise<CreateResult<ResultRecordType>> => {
        const url = `${apiUrl}/${resource}`;
        return httpClient(url, {
            method: 'POST',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({
            data: { ...params.data, id: json._id as Identifier } as unknown as ResultRecordType,
        }));
    },

    update: (resource, params) => {
        const url = `${apiUrl}/${resource}/${params.id}`;
        return httpClient(url, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: { ...json, id: json._id } }));  // Mapea _id a id
    },

    delete: (resource, params) => {
        const url = `${apiUrl}/${resource}/${params.id}`;
        return httpClient(url, {
            method: 'DELETE',
        }).then(({ json }) => ({ data: { ...json, id: json._id } }));  // Mapea _id a id
    },

    // Métodos no implementados
    getMany: function <RecordType extends RaRecord = any>(resource: string, params: GetManyParams<RecordType> & QueryFunctionContext): Promise<GetManyResult<RecordType>> {
        throw new Error('Function not implemented.');
    },
    getManyReference: function <RecordType extends RaRecord = any>(resource: string, params: GetManyReferenceParams & QueryFunctionContext): Promise<GetManyReferenceResult<RecordType>> {
        throw new Error('Function not implemented.');
    },
    updateMany: function <RecordType extends RaRecord = any>(resource: string, params: UpdateManyParams): Promise<UpdateManyResult<RecordType>> {
        throw new Error('Function not implemented.');
    },
    deleteMany: function <RecordType extends RaRecord = any>(resource: string, params: DeleteManyParams<RecordType>): Promise<DeleteManyResult<RecordType>> {
        throw new Error('Function not implemented.');
    }
};

export default dataProvider;