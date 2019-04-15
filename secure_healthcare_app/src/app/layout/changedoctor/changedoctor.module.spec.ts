import { ChangedoctorModule } from './changedoctor.module';

describe('ChangedoctorModule', () => {
  let changedoctorModule: ChangedoctorModule;

  beforeEach(() => {
    changedoctorModule = new ChangedoctorModule();
  });

  it('should create an instance', () => {
    expect(changedoctorModule).toBeTruthy();
  });
});
