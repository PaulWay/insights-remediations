'use strict';

const impl = require('./impl');
const base = require('../../test');
const { mockRequest } = require('../testUtils');
const request = require('../../util/request');

describe('sources impl', function () {
    beforeEach(mockRequest);

    describe('findSources', function () {
        test('obtains a list of sources by source_ref', async function () {
            base.getSandbox().stub(request, 'run').resolves({
                statusCode: 200,
                body: {
                    meta: {
                        count: 2,
                        limit: 100,
                        offset: 0
                    },
                    data: [{
                        created_at: '2019-12-13T11:47:00Z',
                        id: '1231',
                        name: 'We will be adding receptor',
                        source_ref: '72e67490-010a-4c69-a445-97017ef2a696',
                        source_type_id: '9',
                        uid: '49cd4278-3be8-4862-944f-17187c3b568e',
                        updated_at: '2019-12-13T11:47:00Z',
                        tenant: '6089719'
                    }, {
                        created_at: '2019-12-13T11:51:51Z',
                        id: '1232',
                        name: 'Adding receptor',
                        source_ref: 'de91d755-e1da-4ae2-b173-7d56f5df7c86',
                        source_type_id: '9',
                        uid: 'd6f76802-5a47-42bc-b89a-f1abf17b5f2c',
                        updated_at: '2019-12-13T11:51:51Z',
                        tenant: '6089719'
                    }]
                },
                headers: {}
            });

            const results = await impl.findSources([
                '72e67490-010a-4c69-a445-97017ef2a696', 'de91d755-e1da-4ae2-b173-7d56f5df7c86'
            ]);
            results.should.have.size(2);
            results.should.have.property('72e67490-010a-4c69-a445-97017ef2a696');
            results['72e67490-010a-4c69-a445-97017ef2a696'].should.have.property('id', '1231');
            results.should.have.property('de91d755-e1da-4ae2-b173-7d56f5df7c86');
            results['de91d755-e1da-4ae2-b173-7d56f5df7c86'].should.have.property('id', '1232');
        });
    });

    describe('getEndoints', function () {
        test('obtains endpoints for a given sources id', async function () {
            base.getSandbox().stub(request, 'run').resolves({
                statusCode: 200,
                body: {
                    meta: {
                        count: 1,
                        limit: 100,
                        offset: 0
                    },
                    data: [{
                        created_at: '2019-12-13T11:47:01Z',
                        default: true,
                        id: '805',
                        receptor_node: 'dsasd',
                        role: 'sattelite',
                        source_id: '1231',
                        updated_at: '2019-12-13T11:47:01Z',
                        tenant: '6089719'
                    }]
                },
                headers: {}
            });

            const results = await impl.getEndoints(['1231']);
            results.should.have.size(1);
            results[0].should.have.property('receptor_node', 'dsasd');
        });

        test('returns null on 404', async function () {
            base.getSandbox().stub(request, 'run').resolves({
                statusCode: 404,
                headers: {}
            });

            const results = await impl.getEndoints(['1231']);
            (results === null).should.be.true();
        });
    });

    describe('getSourceInfo', function () {
        test('obtains a list of sources with endpoints', async function () {
            const mock = base.getSandbox().stub(request, 'run');
            mock.onFirstCall().resolves({
                statusCode: 200,
                body: {
                    meta: {
                        count: 2,
                        limit: 100,
                        offset: 0
                    },
                    data: [{
                        created_at: '2019-12-13T11:47:00Z',
                        id: '1231',
                        name: 'We will be adding receptor',
                        source_ref: '72e67490-010a-4c69-a445-97017ef2a696',
                        source_type_id: '9',
                        uid: '49cd4278-3be8-4862-944f-17187c3b568e',
                        updated_at: '2019-12-13T11:47:00Z',
                        tenant: '6089719'
                    }, {
                        created_at: '2019-12-13T11:51:51Z',
                        id: '1232',
                        name: 'Adding receptor',
                        source_ref: 'de91d755-e1da-4ae2-b173-7d56f5df7c86',
                        source_type_id: '9',
                        uid: 'd6f76802-5a47-42bc-b89a-f1abf17b5f2c',
                        updated_at: '2019-12-13T11:51:51Z',
                        tenant: '6089719'
                    }]
                },
                headers: {}
            });

            mock.onSecondCall().resolves({
                statusCode: 200,
                body: {
                    meta: {
                        count: 1,
                        limit: 100,
                        offset: 0
                    },
                    data: [{
                        created_at: '2019-12-13T11:47:01Z',
                        default: true,
                        id: '805',
                        receptor_node: 'dsasd',
                        role: 'sattelite',
                        source_id: '1231',
                        updated_at: '2019-12-13T11:47:01Z',
                        tenant: '6089719'
                    }]
                },
                headers: {}
            });

            mock.onThirdCall().resolves({
                statusCode: 404,
                headers: {}
            });

            const results = await impl.getSourceInfo([
                '72e67490-010a-4c69-a445-97017ef2a696', 'de91d755-e1da-4ae2-b173-7d56f5df7c86'
            ]);
            results.should.have.size(2);
            results.should.have.property('72e67490-010a-4c69-a445-97017ef2a696');
            const first = results['72e67490-010a-4c69-a445-97017ef2a696'];
            first.should.have.property('id', '1231');
            first.should.have.property('endpoints');
            first.endpoints.should.have.size(1);
            first.endpoints[0].should.have.property('receptor_node', 'dsasd');
            const second = results['de91d755-e1da-4ae2-b173-7d56f5df7c86'];
            second.should.have.property('id', '1232');
            second.should.have.property('endpoints');
            (second.endpoints === null).should.be.true();
        });
    });
});