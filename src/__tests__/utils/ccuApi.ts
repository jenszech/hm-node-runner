import { getCurrentVariables, getSysMgr, setValueToSysVar } from '../../utils/ccuApi';
import { getMeasureFromConfig } from '../../jobs/InfluxExporter';
import { logger } from '../../logger';
import { SystemVariable } from 'homematic-js-xmlapi';

test('ccuAPi.setValueTpSysVar', () => {
  const sysMgr = getSysMgr();
  const testObj = new SystemVariable({
    _attributes: {
      name: 'TestObject',
      ise_id: '1234',
      value: 5,
      value_list: '',
      type: 4,
      timestamp: Date.now(),
    },
  });
  sysMgr.updateSysVar(testObj);

  const sysVar = getSysMgr().getVariableByName('TestObject');
  expect(sysVar).not.toBeNull();
  expect(sysVar?.value).toBe(5);
  setValueToSysVar(sysVar, 1);
  expect(sysVar?.value).toBe(1);
});
