create table ODS$APPLICATION_LIST
(
  appl_name         VARCHAR2(255),
  appl_url          VARCHAR2(1000),
  appl_html_name    VARCHAR2(255),
  appl_order        NUMBER,
  appl_is_separator CHAR(1) default 'N'
)
-- Add comments to the table
comment on table ODS$APPLICATION_LIST
  is 'Список інших додатків';
-- Add comments to the columns
comment on column ODS$APPLICATION_LIST.appl_id
  is 'Id запису';
comment on column ODS$APPLICATION_LIST.appl_name
  is 'Назва додатку';
comment on column ODS$APPLICATION_LIST.appl_url
  is 'URL для переходу к додатку';
comment on column ODS$APPLICATION_LIST.appl_html_name
  is 'Назва HTML елементу в меню';
comment on column ODS$APPLICATION_LIST.appl_order
  is 'Порядок сортування';
comment on column ODS$APPLICATION_LIST.appl_is_separator
  is 'Ознака - строка являе собою роздільник чи ні';
