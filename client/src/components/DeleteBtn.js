const DeleteChatBtn = ({ handleDeleteChat }) => {
  return (
    <button
      onClick={handleDeleteChat}
      type="button"
      class="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-4 py-2 text-center leading-5"
    >
      Delete
    </button>
  );
};

export default DeleteChatBtn;
