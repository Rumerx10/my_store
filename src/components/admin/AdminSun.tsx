// The shop's sun in the seller centre's top-right corner (globals.css .sun-*): the rays behind
// the frosted panels, the disc over them so their blur doesn't smear it. Not printed.
const AdminSun = () => (
  <div aria-hidden="true" className="print:hidden">
    <div className="sun-back">
      <div className="sun-rays" />
    </div>
    <div className="sun-top sun-admin">
      <div className="sun-disc" />
    </div>
  </div>
);

export default AdminSun;
