PGDMP  3    (        
        }            LibreriaAssignment    17.4    17.4     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            �           1262    18407    LibreriaAssignment    DATABASE     z   CREATE DATABASE "LibreriaAssignment" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'es-MX';
 $   DROP DATABASE "LibreriaAssignment";
                     postgres    false            �            1259    18494    admin    TABLE     �   CREATE TABLE public.admin (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL
);
    DROP TABLE public.admin;
       public         heap r       postgres    false            �            1259    18493    admin_id_seq    SEQUENCE     �   CREATE SEQUENCE public.admin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.admin_id_seq;
       public               postgres    false    218            �           0    0    admin_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.admin_id_seq OWNED BY public.admin.id;
          public               postgres    false    217            �            1259    18518    books    TABLE     �   CREATE TABLE public.books (
    id integer NOT NULL,
    title character varying(500),
    author character varying(255),
    isbn character varying(255),
    release_date timestamp without time zone,
    user_id integer,
    users_id integer
);
    DROP TABLE public.books;
       public         heap r       postgres    false            �            1259    18517    books_id_seq    SEQUENCE     �   CREATE SEQUENCE public.books_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.books_id_seq;
       public               postgres    false    222            �           0    0    books_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.books_id_seq OWNED BY public.books.id;
          public               postgres    false    221            �            1259    18505    users    TABLE     �   CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    name character varying(255),
    password character varying(255),
    estado boolean DEFAULT true
);
    DROP TABLE public.users;
       public         heap r       postgres    false            �            1259    18504    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public               postgres    false    220            �           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public               postgres    false    219            +           2604    18497    admin id    DEFAULT     d   ALTER TABLE ONLY public.admin ALTER COLUMN id SET DEFAULT nextval('public.admin_id_seq'::regclass);
 7   ALTER TABLE public.admin ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    217    218    218            .           2604    18521    books id    DEFAULT     d   ALTER TABLE ONLY public.books ALTER COLUMN id SET DEFAULT nextval('public.books_id_seq'::regclass);
 7   ALTER TABLE public.books ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    221    222    222            ,           2604    18508    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    219    220    220            �          0    18494    admin 
   TABLE DATA           7   COPY public.admin (id, username, password) FROM stdin;
    public               postgres    false    218   �       �          0    18518    books 
   TABLE DATA           Y   COPY public.books (id, title, author, isbn, release_date, user_id, users_id) FROM stdin;
    public               postgres    false    222   u       �          0    18505    users 
   TABLE DATA           B   COPY public.users (id, email, name, password, estado) FROM stdin;
    public               postgres    false    220   �        �           0    0    admin_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.admin_id_seq', 2, true);
          public               postgres    false    217            �           0    0    books_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.books_id_seq', 12, true);
          public               postgres    false    221            �           0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 7, true);
          public               postgres    false    219            0           2606    18501    admin admin_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.admin DROP CONSTRAINT admin_pkey;
       public                 postgres    false    218            2           2606    18503    admin admin_username_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_username_key UNIQUE (username);
 B   ALTER TABLE ONLY public.admin DROP CONSTRAINT admin_username_key;
       public                 postgres    false    218            8           2606    18527    books books_isbn_key 
   CONSTRAINT     O   ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_isbn_key UNIQUE (isbn);
 >   ALTER TABLE ONLY public.books DROP CONSTRAINT books_isbn_key;
       public                 postgres    false    222            :           2606    18525    books books_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.books DROP CONSTRAINT books_pkey;
       public                 postgres    false    222            4           2606    18515    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public                 postgres    false    220            6           2606    18513    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public                 postgres    false    220            ;           2606    18528    books fk_users    FK CONSTRAINT     n   ALTER TABLE ONLY public.books
    ADD CONSTRAINT fk_users FOREIGN KEY (users_id) REFERENCES public.users(id);
 8   ALTER TABLE ONLY public.books DROP CONSTRAINT fk_users;
       public               postgres    false    4662    220    222            �   �   x�E���   �s<�g�2o�RI�U�2�ŲMRT����;����,�_��uݮ�B��[13������c��%�}}q�^k�w���쟾�p�9������`��_ĺx#I�Q#*�K~
���t�;���D^�Hsd�ʡj2\! �t�2�      �     x�U��N�0@��W����n��H�*���u�$��ʉ�I*ѿ���#��(����`�إ�̌��x���8���v'|����Ba�t��Tƒ�h�i:$-Q���#
X��#T3���|�=r;�U��a�e�n͹?�Ə�6��٢���Y�P��ܬ�
�`3�վ�U��Î���m*'Y��y�J���VS��h-U!��#jЂ4lB�Ӝ�p��kL�ș�c«�tD$�ߚiK�n%]�v�`��F��_z      �   X  x�U�Ir�@ @�5�"�H7�����B��Pـ2CZ��>}L�/�_}@�Q]G|FyT]KD�QEHQ�>�ר,1��гf�#V��a�K�D��T�RN����xõMY��9��ߕ�s�DK�	�o�RV��/@N��*�E:��QSm�a�� ?�	r�5ه�m�r�w�� ��Q��A�4���R����j��D�9����_��/��2V�W���dJ����~2�7CϢg�}��;�<�_��z���fi�J+mA��8�魵�w�d��6���Ͻ�7A}��%$�`����~/87��"�;/ᢛ���]����5���:_wGE><~(�$� ����     