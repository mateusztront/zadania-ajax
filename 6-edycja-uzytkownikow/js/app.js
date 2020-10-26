import { addForm } from "./_add-new-form";
import { loadUserList, bindListEvents } from "./_list";
import "../scss/style.scss";

const ul = document.querySelector(".users");

loadUserList(ul);
bindListEvents(ul);
addForm(ul);





