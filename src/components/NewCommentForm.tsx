import classNames from 'classnames';
import React, { useState } from 'react';
import { Post } from '../types/Post';
import { CommentData } from '../types/Comment';

type Props = {
  selectedPost: Post;
  addComment: (comment: CommentData) => Promise<void>;
};

export const NewCommentForm: React.FC<Props> = ({
  selectedPost,
  addComment,
}) => {
  const [inputs, setInputs] = useState({
    name: '',
    email: '',
    body: '',
  });
  const [errors, setErrors] = useState({
    nameError: '',
    emailError: '',
    bodyError: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setInputs(prevInputs => ({
      ...prevInputs,
      [name]: value,
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [`${name}Error`]: '',
    }));
  };

  const clearForm = () => {
    setInputs({
      name: '',
      email: '',
      body: '',
    });
    setErrors({
      nameError: '',
      emailError: '',
      bodyError: '',
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let hasError = false;

    const { name, email, body } = inputs;
    const { nameError, emailError, bodyError } = errors;

    if (selectedPost) {
      if (!name) {
        setErrors(prevErrors => ({
          ...prevErrors,
          nameError: 'Name is required',
        }));
        hasError = true;
      }

      if (!email) {
        setErrors(prevErrors => ({
          ...prevErrors,
          emailError: 'Email is required',
        }));
        hasError = true;
      }

      if (!body) {
        setErrors(prevErrors => ({
          ...prevErrors,
          bodyError: 'Text is required',
        }));
        hasError = true;
      }

      if (hasError) {
        return;
      }

      if (!nameError && !emailError && !bodyError) {
        const newComment: CommentData = {
          postId: selectedPost.id,
          name,
          email,
          body,
        };

        setIsLoading(true);

        addComment(newComment)
          .then(() => {
            setInputs(prevInputs => ({
              ...prevInputs,
              body: '',
            }));
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    }
  };

  const { nameError, emailError, bodyError } = errors;
  const { body, email, name } = inputs;

  return (
    <form data-cy="NewCommentForm" onSubmit={handleSubmit}>
      <div className="field" data-cy="NameField">
        <label className="label" htmlFor="comment-author-name">
          Author Name
        </label>

        <div className="control has-icons-left has-icons-right">
          <input
            type="text"
            name="name"
            id="comment-author-name"
            placeholder="Name Surname"
            className={classNames('input', { 'is-danger': nameError })}
            value={name}
            onChange={handleChange}
          />

          <span className="icon is-small is-left">
            <i className="fas fa-user" />
          </span>

          {nameError && (
            <span
              className="icon is-small is-right has-text-danger"
              data-cy="ErrorIcon"
            >
              <i className="fas fa-exclamation-triangle" />
            </span>
          )}
        </div>

        {nameError && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Name is required
          </p>
        )}
      </div>

      <div className="field" data-cy="EmailField">
        <label className="label" htmlFor="comment-author-email">
          Author Email
        </label>

        <div className="control has-icons-left has-icons-right">
          <input
            type="text"
            name="email"
            id="comment-author-email"
            placeholder="email@test.com"
            className={classNames('input', { 'is-danger': emailError })}
            value={email}
            onChange={handleChange}
          />

          <span className="icon is-small is-left">
            <i className="fas fa-envelope" />
          </span>

          {emailError && (
            <span
              className="icon is-small is-right has-text-danger"
              data-cy="ErrorIcon"
            >
              <i className="fas fa-exclamation-triangle" />
            </span>
          )}
        </div>

        {emailError && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Email is required
          </p>
        )}
      </div>

      <div className="field" data-cy="BodyField">
        <label className="label" htmlFor="comment-body">
          Comment Text
        </label>

        <div className="control">
          <textarea
            id="comment-body"
            name="body"
            placeholder="Type comment here"
            className={classNames('textarea', { 'is-danger': bodyError })}
            value={body}
            onChange={handleChange}
          />
        </div>

        {bodyError && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Enter some text
          </p>
        )}
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button
            type="submit"
            className={classNames('button is-link', {
              'is-loading': isLoading,
            })}
          >
            Add
          </button>
        </div>

        <div className="control">
          <button
            type="reset"
            className="button is-link is-light"
            onClick={clearForm}
          >
            Clear
          </button>
        </div>
      </div>
    </form>
  );
};
