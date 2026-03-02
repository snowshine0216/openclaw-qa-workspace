export async function validateRecord(
    record,
    { testCase, CLIENTACTIONTYPEID, MANIPITEMPATH, MANIPSEQUENCEID, MANIPVALUE }
) {
    await since(`${testCase}, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}`)
        .expect(record.CLIENTACTIONTYPEID)
        .toEqual(CLIENTACTIONTYPEID);

    await since(`${testCase}, MANIPITEMPATH should be #{expected}, instead we have #{actual}`)
        .expect(record.MANIPITEMPATH)
        .toEqual(MANIPITEMPATH);
    await since(`${testCase}, MANIPSEQUENCEID should be #{expected}, instead we have #{actual}`)
        .expect(record.MANIPSEQUENCEID)
        .toEqual(MANIPSEQUENCEID);
    await since(`${testCase}, MANIPVALUE should be #{expected}, instead we have #{actual}`)
        .expect(record.MANIPVALUE)
        .toEqual(MANIPVALUE);
    await since(`${testCase}, ACTIONID is #{actual} which does not match the expected format`)
        .expect(record.ACTIONID)
        .toMatch(/^[0-9]+$/);
    await since(`${testCase}, CACHEIND is #{actual} which does not match the expected format`)
        .expect(record.CACHEIND)
        .toMatch(/^[0-6]$/);
    await since(`${testCase}, CACHEINSTANCEID should be defined but is not`)
        .expect(record.CACHEINSTANCEID)
        .toBeDefined();
    await since(`${testCase}, CLIENTMODELLOADINGSTARTTIME is #{actual} which does not match the expected format`)
        .expect(record.CLIENTMODELLOADINGSTARTTIME)
        .toMatch(/^[0-9]{13}$/);
    await since(`${testCase}, CLIENTMODELLOADINGTIME is #{actual} which does not match the expected format`)
        .expect(record.CLIENTMODELLOADINGTIME)
        .toMatch(/^[0-9]+$/);
    await since(`${testCase}, CTNETWORKTYPE should be #{expected}, instead we have #{actual`)
        .expect(record.CTNETWORKTYPE)
        .toEqual('Online');
    await since(`${testCase}, CTRENDERSTARTTIME is #{actual} which does not match the expected format`)
        .expect(record.CTRENDERSTARTTIME)
        .toMatch(/^[0-9]{13}$/);
    await since(`${testCase}, CTRENDERTIME is #{actual} which does not match the expected format`)
        .expect(record.CTRENDERTIME)
        .toMatch(/^[0-9]+$/);
    await since(`${testCase}, CTRECRECTIME is #{actual} which does not match the expected format`)
        .expect(record.CTREQRECTIME)
        .toMatch(/^[0-9]+$/);
    await since(`${testCase}, CTREQUESTTIME is #{actual} which does not match the expected format`)
        .expect(record.CTREQUESTTIME)
        .toMatch(/^[0-9]{13}$/);
    await since(`${testCase}, CTSESSIONID is #{actual} which does not match the expected format`)
        .expect(record.CTSESSIONID)
        .toMatch(/^[A-Z0-9]{32}$/);
    await since(`${testCase}, CUSTOMID is #{actual} which does not match the expected format`)
        .expect(record.CUSTOMID)
        .toMatch(/^[A-Z0-9]{32}$/);
    await since(`${testCase}, DEVICEINSTID is #{actual} which does not match the expected format`)
        .expect(record.DEVICEINSTID)
        .toMatch(/^[A-Z0-9]{40}$/);
    if (testCase !== 'Switch Page') {
        await since(`${testCase}, JOBID is #{actual} which does not match the expected format`)
            .expect(record.JOBID)
            .toMatch(/^[0-9]+$/);
    }
    await since(`${testCase}, MESSAGEID is #{actual} which does not match the expected format`)
        .expect(record.MESSAGEID)
        .toMatch(/^[A-Z0-9]{32}$/);
    await since(`${testCase}, OBJECTID is #{actual} which does not match the expected format`)
        .expect(record.OBJECTID)
        .toMatch(/^[A-Z0-9]{32}$/);
    await since(`${testCase}, PAGEID is #{actual} which does not match the expected format`)
        .expect(record.PAGEID)
        .toMatch(/^[K,W][A-Z0-9]+--K[A-Z0-9]+$/);
    await since(`${testCase}, PROJECTID is #{actual} which does not match the expected format`)
        .expect(record.PROJECTID)
        .toMatch(/^[A-Z0-9]{32}$/);
    await since(`${testCase}, USERID is #{actual} which does not match the expected format`)
        .expect(record.USERID)
        .toMatch(/^[A-Z0-9]{32}$/);
}
